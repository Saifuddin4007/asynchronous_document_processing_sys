import { Worker } from 'bullmq';
import pool from '../db/pool.js';
import { redisConnection } from '../db/redis.js';
import { documentProcessor } from '../services/documentProcessor.js';

export const worker = new Worker(
    'document-processing',

    async (job) => {     //!Processor function
        const { document_id, original_filename, stored_filename, mime_type } = job.data;

        try {
            console.log(`processing job ${job.id} for document ${document_id}`);

            //!Update progress
            await job.updateProgress(10);
            await pool.query(
                `UPDATE jobs
            SET status='processing',
                progress_percent= 10,
                started_at= NOW()
            WHERE document_id= $1`,
                [document_id]
            );

            //!Update status of documents in postgreSQL
            await pool.query(
                `UPDATE documents
            SET status= 'processing'
            WHERE document_id= $1`,
                [document_id]
            );

            await job.updateProgress(30);
            await pool.query(
                `UPDATE jobs
            SET progress_percent= 30
            WHERE document_id= $1`,
                [document_id]
            );

            //! Do Actual document processing

            const docProcessorResult = await documentProcessor(stored_filename, mime_type);

            await job.updateProgress(70);
            await pool.query(
                `UPDATE jobs
            SET progress_percent= 70
            WHERE document_id= $1`,
                [document_id]
            );


            //!Save result in transaction
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                await client.query(
                    `UPDATE documents
                    SET status= 'completed'
                    WHERE document_id= $1`,
                    [document_id]
                );

                await client.query(
                    `INSERT INTO results (extracted_data, reviewed_data, is_finalized, finalised_at, document_id)
                    VALUES($1, $2, $3, $4, $5 )
                    ON CONFLICT(document_id)
                    DO UPDATE SET
                        extracted_data= EXCLUDED.extracted_data,
                        reviewed_data= EXCLUDED.reviewed_data,
                        is_finalized= EXCLUDED.is_finalized,
                        finalised_at= EXCLUDED.finalised_at`,
                    [docProcessorResult, null, false, null, document_id]
                );

                await client.query(
                    `UPDATE jobs
                SET progress_percent= 100,
                    status= 'completed',
                    completed_at= NOW(),
                    attempt_number=$1
                WHERE document_id= $2`,
                    [job.attemptsMade + 1, document_id]
                );

                await client.query('COMMIT');


            } catch (err) {
                await client.query('ROLLBACK');
                throw err;

            } finally {
                client.release();
            }
            await job.updateProgress(100);

            return { document_id, status: 'completed', docProcessorResult };
        } catch (err) {

            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const isLastAttempt = job.attemptsMade + 1 >= job.opts.attempts;

                const documentStatus= isLastAttempt ? 'failed' : 'retrying';

                await client.query(
                    `UPDATE documents
                SET status= $1
                WHERE document_id= $2`,
                    [documentStatus, document_id]
                );

                
                const jobStatus = isLastAttempt ? 'failed' : 'retrying';

                await client.query(
                    `UPDATE jobs
                SET status= $1,
                    error_message= $2,
                    completed_at= $3,
                    progress_percent= $4
                WHERE document_id= $5`,
                    [jobStatus, err.message, isLastAttempt ? NOW() : null, isLastAttempt ? -1 : Number(job.progress) || 0, document_id]
                );

                await client.query('COMMIT');

            }catch (err) {
                await client.query('ROLLBACK');
                throw err;

            }finally{
                client.release();
            }

            console.log(err);
            throw err;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

console.log('Worker started...')

worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed: ${err.message}`);
});

process.on('SIGINT', async () => {
    await worker.close();
    process.exit(0);
});