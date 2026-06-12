# Workflows — book-summary-api

---

## 1. Book Upload Flow

**Trigger:** `POST /api/v1/books` with `multipart/form-data` (file + title + author)

**Steps:**
1. `BookController.upload()` receives file via `FileInterceptor('file')`
2. `UploadBookUseCase.execute(dto, file, userId)`:
   - Validate `file.mimetype === 'application/pdf'`
   - Validate `file.size <= MAX_FILE_SIZE`
   - `fileStorage.upload(file)` → `{ storageKey, url, sizeBytes }`
   - Create `Book` entity with `status = UPLOADING`
   - `bookRepository.save(book)`
   - Emit `BookUploadedEvent` (triggers background processing)
3. Return `BookResponseDto` with `status = UPLOADING`

**Output:** Book record in DB, file in storage, Job queued.

**Affected Entities:** Book/Source, Job

---

## 2. AI Processing Pipeline (Background)

**Trigger:** `BookUploadedEvent` / Job with `type = EXTRACT_CONCEPTS`

**Steps:**
1. Worker picks up PENDING Job → sets `status = RUNNING`
2. `aiProvider.extractTextFromPdf(pdfBuffer)` → raw text
3. Source status → `PROCESSING`
4. **Job: EXTRACT_CONCEPTS** — `aiProvider.extractConcepts(text)` → persist `Concept[]` + `ConceptRelation[]`
5. **Job: GENERATE_ARTIFACTS** — for each concept, `aiProvider.generateSummary(...)` → persist `Artifact` records (type SUMMARY, FLASHCARD, EXAMPLE)
6. **Job: GENERATE_ASSESSMENT** — `aiProvider.generateQuiz(...)` → persist `Assessment` + `Question[]` + `QuestionOption[]`
7. Source status → `READY`
8. Job status → `COMPLETED`

**On failure:** Job status → `FAILED` with `errorMessage`. Source status → `FAILED`. Retry = new Job row.

**Output:** Source READY, Concepts populated, Artifacts populated, Assessment populated.

**Affected Entities:** Job, Source/Book, Concept, ConceptRelation, Artifact, Assessment, Question, QuestionOption

---

## 3. Summary Generation Flow (On-Demand)

**Trigger:** `POST /api/v1/books/:id/summary`

**Steps:**
1. `SummaryController` → `GenerateSummaryUseCase.execute(dto, userId)`
2. Load Book → verify `status === READY` and `book.belongsToUser(userId)`
3. Check `summaryRepository.existsByBookId(bookId)` — if exists, decide re-generate or return
4. `fileStorage.download(book.fileInfo.storageKey)` → buffer
5. `aiProvider.extractTextFromPdf(buffer)` → text
6. `aiProvider.generateSummary(text, { targetWordCount, keyPointCount })` → `SummaryResult`
7. Persist Summary entity via `summaryRepository.save()`
8. Return `SummaryResponseDto`

**Output:** Summary record in DB.

**Affected Entities:** Book/Source, Summary/Artifact

---

## 4. Quiz Generation Flow

**Trigger:** `POST /api/v1/books/:id/quiz`

**Steps:**
1. `QuizController` → `GenerateQuizUseCase.execute(dto, userId)`
2. Verify book ownership + `READY` status
3. `summaryRepository.findByBookId(bookId)` → throw `NotFoundException` if missing
4. `aiProvider.generateQuiz(summary.content, { difficulty, questionCount })` → `QuizResult`
5. Map `QuizResult` → `Quiz` + `Question[]` domain entities
6. `quizRepository.save(quiz)` (with questions)
7. Return `QuizResponseDto` — **correctOption excluded**

**Output:** Quiz + Questions in DB.

**Affected Entities:** Quiz, Question (quiz)

---

## 5. Quiz Submission Flow

**Trigger:** `POST /api/v1/quizzes/:id/submit`

**Steps:**
1. `QuizController` → `SubmitQuizUseCase.execute(dto, userId)`
2. Load quiz + questions with correct options
3. Score answers: compare `dto.answers[i]` to `question.correctOption`
4. Compute `score`, `totalQuestions`, `percentageScore`
5. Update `Progress` via `progressRepository.upsert()`
6. Return `QuizResultDto` including `correctOptions[]`

**Output:** Score returned, Progress updated.

**Affected Entities:** Quiz, Question, Progress/LearnerConceptMastery

---

## 6. Concept Extraction Flow (On-Demand)

**Trigger:** `POST /api/v1/books/:id/concepts/extract`

**Steps:**
1. `ConceptController` → `ExtractConceptsUseCase.execute(bookId, userId)`
2. Verify book ownership + `READY` status
3. Load summary text
4. `conceptRepository.deleteByBookId(bookId)` — idempotent re-extraction
5. `aiProvider.extractConcepts(summaryText)` → `ConceptResult[]`
6. Persist `Concept[]` + inferred `ConceptRelation[]`
7. Return `ConceptListResponseDto`

**Output:** Concept knowledge graph in DB.

**Affected Entities:** Concept, ConceptRelation

---

## 7. Assessment Attempt Flow

**Trigger:** `POST /api/v1/assessments` + `POST /api/v1/assessments/:id/submit`

**Create Step:**
1. `AssessmentController` → `CreateAssessmentUseCase.execute(dto, userId)`
2. Create `Assessment` entity for a given sourceId
3. Persist → return `AssessmentResponseDto`

**Submit Step:**
1. `AssessmentController` → `SubmitAssessmentUseCase.execute(dto, userId)`
2. Load `Assessment` → load `AssessmentAttempt` (verify ownership + IN_PROGRESS)
3. Score each `QuestionAttempt` against `QuestionOption.isCorrect`
4. Compute total `score`; set `submittedAt = now()`
5. `progressRepository.update()` — bump quizzesTaken, update averageScore
6. Update `LearnerConceptMastery` for concept-tagged questions
7. Return `AssessmentResponseDto` with score

**Output:** AssessmentAttempt + QuestionAttempts persisted, Progress updated, Mastery updated.

**Affected Entities:** Assessment, AssessmentAttempt, QuestionAttempt, Progress, LearnerConceptMastery

---

## 8. Progress Tracking Flow

**Trigger:** Called internally after quiz/assessment submission; also `PATCH /api/v1/progress`

**Steps:**
1. `TrackProgressUseCase.execute({ userId, bookId, completedPages })`
2. `progressRepository.upsert()` — create if new, update if exists
3. Compare `lastActivity` to today → recalculate `streakDays`
4. Return `ProgressResponseDto`

**Affected Entities:** Progress
