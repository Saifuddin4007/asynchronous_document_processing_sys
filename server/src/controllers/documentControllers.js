import fs from 'fs/promises';
import path from 'path';
import pool from '../db/pool.js';
import {documentQueue} from '../queue/documentQueue.js';


export const checkHealth = async (req,res) =>{
    try{
        const {rows} = await pool.query(
            `SELECT NOW()`
        );
        res.status(200).json({status:"Healthy", database:"Connected", time: rows[0].now});

    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const uploadDocument= async (req,res) =>{
    let docId;

    try{
        if(!req.file){
            return res.status(404).json({Error: 'file Not found'});
        }

        const {originalname, filename, path: fileUrl, mimetype, size }= req.file;

        //!Insert document record into postgresql
        const {rows}= await pool.query(
            `INSERT INTO documents(original_filename, stored_filename, mime_type, file_size, status )
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *`,
            [originalname, filename, mimetype, size ]
        );

        docId= rows[0].document_id;

        //!Add job's execution into jobs table
        const jobsTable= await pool.query(
            `INSERT INTO jobs(status, progress_percent, attempt_number, document_id)
            VALUES('queued', $1, $2, $3)
            RETURNING *`,
            [0, 0, docId]
        );

        //!Add document to Queue

        //*Add job to BullMQ
        const job= await documentQueue.add(
            'process-document',
            {
                document_id: docId,
                original_filename: originalname,
                stored_filename: filename,
                mime_type: mimetype
            },
            {
                priority: 1,
                delay: 0,
            }
        );

        const result= await pool.query(
            `UPDATE documents
            SET status= 'queued'
            WHERE document_id= $1
            RETURNING *`,
            [docId]
        );

        res.status(201).json({
            message: 'Document uploaded successfully and document queued for processing',
            document: result.rows[0],
            jobId: job.id,
            docId
        });

    }catch(err){
        if(docId){
            await pool.query(
            `UPDATE documents
            SET status= 'queue_failed' 
            WHERE document_id= $1`,
            [docId]
        );
        }

        res.status(500).json({error:err.message});
    }
};


export const getAllDocuments= async (req,res) =>{
    try{
        const {rows} = await pool.query(
            `SELECT * 
            FROM documents
            ORDER BY uploaded_at DESC`
        );
        res.status(200).json({message:"All the documents fetched successfully", documents: rows});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


export const getSingleDocument= async(req,res) =>{
    try{
        const id= req.params.id;
        
        const { rows }= await pool.query(
            `SELECT *
            FROM documents
            WHERE document_id= $1`,
            [id]
        );
        if(rows.length===0){
            return res.status(404).json({message:'Document not found'});
        }
        res.status(200).json({message:'record fetched successfully', document: rows[0]});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

async function fileDelete (storedFilePath){
    try{
        const filePath= path.join(process.cwd(), 'uploads', storedFilePath);
        await fs.unlink(filePath);
        console.log('File deleted successfully');
    }catch(err){
        console.log('Error deleting files', err);
        throw err;
    }
}

export const deleteOneDocument= async(req,res) =>{
    try{
        const id= req.params.id;
        
        const result= await pool.query(
            `SELECT stored_filename
            FROM documents
            WHERE document_id= $1`,
            [id] 
        );
        if(!result.rows[0]){
            return res.status(404).json({error: 'document not found'});
        }
        

        const resultDeletedData = await pool.query(
            `DELETE FROM documents
            WHERE document_id= $1
            RETURNING *`,
            [id]
        );
        if(resultDeletedData.rowCount===0){
            return res.status(404).json({message:'Document not found'});
        }

        try{
            await fileDelete(result.rows[0].stored_filename);
        }catch(err){
            console.log('Physical file cleanp failed', err.message);
        }

        res.status(200).json({message:'Document deleted'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
