import fs from 'fs/promises';
import path from 'path';
import pool from '../db/pool.js';
import { error } from 'console';


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
    try{
        if(!req.file){
            return res.status(404).json({Error: 'file Not found'});
        }

        const {originalname, filename, path: fileUrl, mimetype, size }= req.file;

        //!Insert document record intopostgresql
        const {rows}= await pool.query(
            `INSERT INTO documents(original_filename, stored_filename, mime_type, file_size, status )
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *`,
            [originalname, filename, mimetype, size ]
        );
        res.status(201).json({message: 'Document uploaded successfully', document: rows[0] });

    }catch(err){
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

        await fileDelete(result.rows[0].stored_filename);
        

        const resultDeletedData = await pool.query(
            `DELETE FROM documents
            WHERE document_id= $1
            RETURNING *`,
            [id]
        );
        if(resultDeletedData.rowCount===0){
            return res.status(404).json({message:'Document not found'});
        }

        res.status(200).json({message:'Document deleted'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
