CREATE TABLE IF NOT EXISTS documents(
    document_id BIGSERIAL PRIMARY KEY,
    original_filename TEXT NOT NULL,
    stored_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    status TEXT DEFAULT 'uploaded',
    uploaded_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS jobs(
    job_id BIGSERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'queued',
    progress_percent INT DEFAULT 0 CHECK(progress_percent >=-1 AND progress_percent<=100) ,
    attempt_number INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    document_id BIGINT NOT NULL 
    REFERENCES documents(document_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results(
    result_id BIGSERIAL PRIMARY KEY,
    extracted_data JSONB,
    reviewed_data JSONB,
    is_finalized BOOLEAN DEFAULT FALSE,
    finalised_at TIMESTAMP,
    document_id BIGINT UNIQUE NOT NULL 
    REFERENCES documents(document_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_documents_status ON documents(status); --filtering dashboard based on status

CREATE INDEX idx_jobs_document_id ON jobs(document_id); --fetching jobs of a documet