# Async Document Processing System

A full-stack document processing app for uploading PDF, DOC, and DOCX files, extracting their content in the background, reviewing the result, and exporting the final data as JSON or TXT.

The project is built around an asynchronous queue so large or slow documents do not block the API. Uploads are accepted by the Express server, jobs are pushed into BullMQ, Redis manages the queue, workers extract the document text, and PostgreSQL stores the document, job, and result records.

## What It Does

- Upload PDF, DOC, and DOCX documents.
- Process files asynchronously through Redis and BullMQ.
- Track processing status from the frontend while the worker runs.
- Extract text using `pdf-parse` for PDFs and `mammoth` for DOC/DOCX files.
- Review and edit extracted content before final export.
- Store reviewed data separately from the original extracted data.
- Export reviewed data as JSON or TXT.
- Fall back to extracted data when no reviewed data is available.
- Handle unsupported, corrupted, empty, failed, or timed-out documents.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Queue | BullMQ, Redis |
| Database | PostgreSQL |
| Extraction | `pdf-parse`, `mammoth` |
| Local infrastructure | Docker, Docker Compose |

## Project Structure

```text
doc_processor_app/
  client/                 React frontend
  server/                 Express API, queue setup, workers, controllers
  postgres/
    init/                 Database schema
    migrations/           Database migrations
  docker-compose.yml      PostgreSQL and Redis services
  README.md
```

## Architecture

```text
React frontend
    |
    | HTTP requests
    v
Express API
    |
    | stores document metadata
    v
PostgreSQL
    |
    | queues processing job
    v
BullMQ + Redis
    |
    | worker consumes job
    v
Document processor
    |
    | extracts text from PDF / DOC / DOCX
    v
PostgreSQL results
    |
    | frontend polls status and fetches result
    v
Review, edit, finalize, export
```

## Processing Flow

1. User uploads a supported document from the frontend.
2. The backend stores document metadata and saves the uploaded file.
3. A BullMQ job is added to the Redis-backed queue.
4. The worker picks up the job and detects the document type.
5. Text is extracted using the correct processor.
6. The result is stored in PostgreSQL.
7. The frontend polling UI detects completion.
8. User reviews or edits the extracted data.
9. Reviewed data is saved separately.
10. User exports the final result as JSON or TXT.

## Database Tables

### `documents`

Stores uploaded document metadata.

| Column | Type |
| --- | --- |
| `document_id` | `BIGSERIAL` |
| `original_filename` | `TEXT` |
| `stored_filename` | `TEXT` |
| `mime_type` | `TEXT` |
| `file_size` | `BIGINT` |
| `status` | `TEXT` |

### `jobs`

Tracks background processing jobs.

| Column | Type |
| --- | --- |
| `job_id` | `BIGSERIAL` |
| `status` | `TEXT` |
| `progress_percent` | `INT` |
| `attempt_number` | `INT` |
| `error_message` | `TEXT` |
| `document_id` | `BIGINT` |

### `results`

Stores extracted and reviewed output.

| Column | Type |
| --- | --- |
| `result_id` | `BIGSERIAL` |
| `extracted_data` | `JSONB` |
| `reviewed_data` | `JSONB` |
| `is_finalized` | `BOOLEAN` |
| `finalized_at` | `TIMESTAMP` |
| `document_id` | `BIGINT` |

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd doc_processor_app
```

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=doc_processor
POSTGRES_USER=doc_admin
POSTGRES_PASSWORD=supersecretpassword123

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=7001
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:7001
```

### 4. Start PostgreSQL and Redis

From the project root:

```bash
docker compose up
```

### 5. Run the backend

In a new terminal:

```bash
cd server
npm run dev
```

### 6. Run the frontend

In another terminal:

```bash
cd client
npm run dev
```

## Production Build Check

Frontend:

```bash
cd client
npm run build
npm run preview
```

Backend:

```bash
cd server
npm start
```

## API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Check API health |
| `GET` | `/api/v1/documents` | List uploaded documents |
| `GET` | `/api/v1/documents/:id` | Get a single document |
| `POST` | `/api/v1/documents/upload` | Upload a document |
| `DELETE` | `/api/v1/documents/:id` | Delete a document |
| `GET` | `/api/v1/jobs/:documentId` | Get processing status |
| `GET` | `/api/v1/results/:documentId` | Get extraction result |
| `PATCH` | `/api/v1/results/:documentId` | Save reviewed result |
| `GET` | `/api/v1/export/:documentId?format=json` | Export as JSON |
| `GET` | `/api/v1/export/:documentId?format=text` | Export as TXT |

## Export Behavior

Export uses reviewed data first. If the document has not been reviewed yet, the system exports the extracted data instead.

```text
reviewed_data
    |
    | unavailable
    v
extracted_data
```

Supported formats:

- JSON
- TXT

## Reliability Notes

The system is designed to handle:

- Unsupported file types
- Corrupted documents
- Empty extraction output
- Queue processing failures
- Invalid processing states
- Polling timeout failures
- Multiple simultaneous uploads
- Multiple browser tabs checking job status

## Possible Improvements

- OCR support for scanned documents
- Authentication and authorization
- Upload history dashboard
- Retry failed jobs from the UI
- WebSocket updates instead of polling
- Cloud storage for uploaded files
- Multi-file uploads
- AI-assisted summarization

## Author

**Saifuddin Khan**  
Backend and full-stack developer focused on scalable systems, asynchronous architectures, and practical engineering workflows.
