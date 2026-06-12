# Domains — book-summary-api

> Note on naming divergence: The application layer uses `Book`/`Summary` terminology.
> The Prisma schema and INJECTION_TOKENS use `Source`/`Artifact`. This reflects an
> in-progress migration. The DB is authoritative; the application layer will follow.

---

## Domain: Source (Book)

**Purpose:** Core aggregate. Represents an uploaded learning material (PDF, EPUB, web URL, video).

**Entities:**
- `Source` (DB aggregate root) — id, ownerId, title, sourceType, status, metadata
- `Book` (domain entity in code) — wraps Source concept in application layer

**Value Objects:**
- `SourceType` — PDF | EPUB | WEB_URL | VIDEO
- `SourceStatus` — UPLOADED → PROCESSING → READY | FAILED
- `BookStatus` — mirrors SourceStatus in the application layer
- `FileInfo` — storageKey, url, sizeBytes, mimeType

**Repository Interface:** `IBookRepository` / `ISourceRepository`

**Use Cases:**
- `UploadBookUseCase` — validate file, store, create entity, trigger job
- `GetBookUseCase` — fetch single book by id + ownership check
- `ListBooksUseCase` — paginated list filtered by userId
- `DeleteBookUseCase` — remove entity + storage file

**Rules:**
- Only READY books can have summaries generated.
- Only books with a summary can have quizzes generated.
- Owner check enforced in every use case — users cannot access others' books.

---

## Domain: Summary (Artifact — SUMMARY type)

**Purpose:** AI-generated text summary of a book.

**Entities:**
- `Summary` (domain entity) — bookId, content, keyPoints[], wordCount
- `Artifact` (DB) — conceptId, type=SUMMARY, content (JSONB)

**Repository Interface:** `ISummaryRepository` / `IArtifactRepository`

**Use Cases:**
- `GenerateSummaryUseCase` — verify READY, extract text, call AI, persist
- `GetSummaryUseCase` — fetch existing summary for a book

**Rules:**
- A book can have only one active summary (re-generation replaces it).
- Summary text is the input for quiz generation and concept extraction.

---

## Domain: Quiz

**Purpose:** Multiple-choice quiz generated from a book summary.

**Entities:**
- `Quiz` — bookId, title, difficulty, questions[]
- `Question` (quiz) — text, options[], correctOption (hidden from API response)

**Value Objects:**
- `QuizDifficulty` — EASY | MEDIUM | HARD

**Repository Interface:** `IQuizRepository`

**Use Cases:**
- `GenerateQuizUseCase` — requires summary to exist; calls AI; persists quiz
- `SubmitQuizUseCase` — scores answers, returns correctOptions

**Rules:**
- `correctOption` is NEVER included in the initial quiz response — only after submission.
- Quiz requires a summary (enforced in GenerateQuizUseCase).

---

## Domain: Concept

**Purpose:** Knowledge graph of key concepts extracted from a book summary.

**Entities:**
- `Concept` — sourceId, name, description, importanceScore
- `ConceptRelation` — sourceConceptId, targetConceptId, relationType, weight

**Value Objects:**
- `ConceptRelationType` — PREREQUISITE | RELATED | PART_OF | EXTENDS

**Repository Interfaces:** `IConceptRepository`, `IConceptRelationRepository`

**Use Cases:**
- `ExtractConceptsUseCase` — AI extracts concepts from summary, persists with relations
- `GetConceptsUseCase` — fetch concepts list for a book

**Rules:**
- Concept extraction is idempotent: re-extracting deletes existing concepts first.
- Concepts belong to a Source and can link to Questions and Artifacts.

---

## Domain: Assessment

**Purpose:** Formal evaluation linked to a Source (not a Quiz — different flow).

**Entities:**
- `Assessment` — sourceId, title (no status on Assessment itself)
- `Question` (assessment) — assessmentId, conceptId?, body, explanation, difficulty
- `QuestionOption` — questionId, content, isCorrect
- `AssessmentAttempt` — userId, assessmentId, score, submittedAt
- `QuestionAttempt` — assessmentAttemptId, questionId, selectedOptionId, isCorrect

**Repository Interfaces:** `IAssessmentRepository`, `IQuestionRepository`, `IAssessmentAttemptRepository`

**Use Cases:**
- `CreateAssessmentUseCase` — create Assessment container for a source
- `SubmitAssessmentUseCase` — score attempt, update progress

**Rules:**
- Assessment has NO status — status is tracked on `AssessmentAttempt`.
- One Source → many Assessments (regenerate without losing prior attempts).
- One Assessment → many AssessmentAttempts (retry allowed, multi-user allowed).
- `isCorrect` on QuestionOption is the answer key; hidden from quiz response.

---

## Domain: Progress

**Purpose:** Tracks a user's reading and learning activity per book.

**Entities:**
- `Progress` (domain entity) — userId, bookId, completedPages, quizzesTaken, averageScore, streakDays
- `LearnerConceptMastery` (DB) — composite PK (userId, conceptId), masteryScore

**Repository Interfaces:** `IProgressRepository`, `ILearnerConceptMasteryRepository`

**Use Cases:**
- `TrackProgressUseCase` — upsert progress, recalculate streakDays
- `GetProgressUseCase` — return full progress summary for the user

**Rules:**
- Progress is updated after quiz submission and assessment submission.
- `LearnerConceptMastery` score is updated based on concept-tagged question performance.

---

## Domain: Job

**Purpose:** Background AI processing pipeline. Decouples upload from computation.

**Entities:**
- `Job` — sourceId, type, status, errorMessage, createdAt

**Value Objects:**
- `JobType` — EXTRACT_CONCEPTS | GENERATE_ARTIFACTS | GENERATE_ASSESSMENT
- `JobStatus` — PENDING → RUNNING → COMPLETED | FAILED

**Repository Interface:** `IJobRepository`

**Rules:**
- Jobs are IMMUTABLE RECORDS — never updated in-place.
- Retry = create a new Job row (full audit trail).
- `canRetry()` is true only for FAILED jobs.

---

## Domain: User

**Purpose:** Identity and ownership anchor.

**Entities:**
- `User` — id (UUID), email, name, createdAt

**Repository Interface:** `IUserRepository`

**Dependencies:** User owns Sources. User tracks AssessmentAttempts. User has LearnerConceptMastery.

---

## Dependency Graph Between Domains

```
User
 └── Source (Book)
      ├── Job              ← background processing
      ├── Concept
      │    ├── ConceptRelation
      │    ├── Artifact (Summary / Flashcard / Example)
      │    └── LearnerConceptMastery ← User
      └── Assessment
           ├── Question
           │    └── QuestionOption
           └── AssessmentAttempt ← User
                └── QuestionAttempt

Progress ← User + Source (denormalised stats)
```
