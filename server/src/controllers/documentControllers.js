import pool from '../db/pool.js';


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