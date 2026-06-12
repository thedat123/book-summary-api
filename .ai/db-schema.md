# Database Schema — book-summary-api

**Database:** PostgreSQL  
**ORM:** Prisma 5  
**Schema file:** `prisma/schema.prisma`

---

## Aggregate Roots

| Aggregate Root | Table | Owns |
|---|---|---|
| User | `users` | sources, assessment_attempts, learner_concept_mastery |
| Source | `sources` | concepts, assessments, jobs |
| Concept | `concepts` | artifacts, questions (via assessment), learner_concept_mastery |
| Assessment | `assessments` | questions, assessment_attempts |

---

## Entity Relationship Overview

```
users (1) ──< sources (N)
users (1) ──< assessment_attempts (N)
users (1) ──< learner_concept_mastery (N)

sources (1) ──< concepts (N)
sources (1) ──< assessments (N)
sources (1) ──< jobs (N)

concepts (1) ──< artifacts (N)
concepts (1) ──< learner_concept_mastery (N)
concepts (N) >──< concepts  [via concept_relations — self-referential]

assessments (1) ──< questions (N)
assessments (1) ──< assessment_attempts (N)

questions (1) ──< question_options (N)
questions (1) ──< question_attempts (N)
questions (N) >── concepts (1)  [optional — conceptId nullable]

assessment_attempts (1) ──< question_attempts (N)
question_attempts (N) >── question_options (1)  [selectedOptionId nullable]
```

---

## Tables

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | varchar UNIQUE | |
| name | varchar NULL | |
| created_at | timestamptz NULL | default now() |

---

### `sources`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK→users | NOT NULL |
| title | text | NOT NULL |
| source_type | enum SourceType | PDF \| EPUB \| WEB_URL \| VIDEO |
| status | enum SourceStatus | UPLOADED → PROCESSING → READY \| FAILED |
| metadata | jsonb NULL | flexible extra fields (file size, url, etc.) |
| created_at | timestamptz NULL | default now() |

---

### `concepts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| source_id | uuid FK→sources | NOT NULL |
| name | text | NOT NULL |
| description | text NULL | |
| importance_score | decimal NULL | AI-assigned ranking |
| created_at | timestamptz NULL | default now() |

---

### `concept_relations`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| source_concept_id | uuid FK→concepts | |
| target_concept_id | uuid FK→concepts | |
| relation_type | enum ConceptRelationType | PREREQUISITE \| RELATED \| PART_OF \| EXTENDS |
| weight | decimal NULL | optional strength score |

---

### `artifacts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| concept_id | uuid FK→concepts | NOT NULL |
| type | enum ArtifactType | SUMMARY \| FLASHCARD \| EXAMPLE |
| content | jsonb | NOT NULL — structured content varies by type |
| created_at | timestamptz NULL | default now() |

**content shape per type:**
- `SUMMARY`: `{ text: string, keyPoints: string[] }`
- `FLASHCARD`: `{ front: string, back: string }`
- `EXAMPLE`: `{ scenario: string, explanation: string }`

---

### `assessments`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| source_id | uuid FK→sources | NOT NULL |
| title | text NULL | AI-generated or user-supplied |
| created_at | timestamptz NULL | default now() |

> No status field — lifecycle is tracked on `assessment_attempts`.

---

### `questions`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| assessment_id | uuid FK→assessments | NOT NULL |
| concept_id | uuid FK→concepts NULL | optional concept tag |
| body | text | NOT NULL |
| explanation | text NULL | shown after submission |
| difficulty | int NULL | 1–5 scale |

---

### `question_options`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| question_id | uuid FK→questions | NOT NULL |
| content | text NULL | |
| is_correct | boolean NULL | answer key — never sent in quiz response |

---

### `assessment_attempts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK→users | NOT NULL |
| assessment_id | uuid FK→assessments | NOT NULL |
| score | decimal NULL | null while in-progress |
| submitted_at | timestamptz NULL | null while in-progress |

---

### `question_attempts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| assessment_attempt_id | uuid FK→assessment_attempts | NOT NULL |
| question_id | uuid FK→questions | NOT NULL |
| selected_option_id | uuid FK→question_options NULL | null = unanswered |
| is_correct | boolean NULL | null = not graded |

---

### `learner_concept_mastery`
| Column | Type | Notes |
|---|---|---|
| user_id | uuid FK→users | PK (composite) |
| concept_id | uuid FK→concepts | PK (composite) |
| mastery_score | decimal NULL | 0.0–1.0 |
| updated_at | timestamptz NULL | |

---

### `jobs`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| source_id | uuid FK→sources | NOT NULL |
| type | enum JobType | EXTRACT_CONCEPTS \| GENERATE_ARTIFACTS \| GENERATE_ASSESSMENT |
| status | enum JobStatus | PENDING → RUNNING → COMPLETED \| FAILED |
| error_message | text NULL | populated on FAILED |
| created_at | timestamptz NULL | default now() |

---

## Lifecycle Ownership

- **Deleting a User** cascades to: sources → concepts → artifacts, concept_relations, assessment_attempts, learner_concept_mastery, jobs.
- **Deleting a Source** cascades to: concepts, assessments, jobs.
- **Jobs are append-only**: retries create a new row, never UPDATE the existing row.
- **AssessmentAttempts**: `submitted_at = null` means in-progress; non-null means completed.

---

## Enums

```
SourceType:          PDF | EPUB | WEB_URL | VIDEO
SourceStatus:        UPLOADED | PROCESSING | READY | FAILED
ArtifactType:        SUMMARY | FLASHCARD | EXAMPLE
ConceptRelationType: PREREQUISITE | RELATED | PART_OF | EXTENDS
JobType:             EXTRACT_CONCEPTS | GENERATE_ARTIFACTS | GENERATE_ASSESSMENT
JobStatus:           PENDING | RUNNING | COMPLETED | FAILED
```
