import pool from "../db/pool.js";



export const getSingleResult= async (req,res)=>{

    try{
        const {documentId}= req.params;

        const result= await pool.query(
            `SELECT
                r.result_id,
                r.extracted_data,
                r.reviewed_data,
                r.is_finalized,
                r.finalised_at,

                d.document_id,
                d.original_filename,
                d.stored_filename,
                d.mime_type,
                d.file_size,
                d.status,
                d.uploaded_at

            FROM results r
            JOIN documents d
            ON r.document_id=d.document_id
            WHERE r.document_id= $1`,
            [documentId]
        );

        if(result.rowCount==0){
            return res.status(404).json({message:'Result Not Found'});
        }

        res.status(200).json({message:'Your Result', result: result.rows[0]});
    }catch(err){
        res.status(500).json({message: err.message});

    }
};



export const updateResult= async (req,res)=>{

    try{
        const {documentId}= req.params;

        const {reviewed_data, is_finalized}= req.body;
        const finalised_at= is_finalized ? new Date() : null;

        if(typeof reviewed_data !== 'object' || !reviewed_data){
            return res.status(400).json({message:'Bad request, reviewed data must be valid object'});
        }


        const result= await pool.query(
            `UPDATE results
            SET reviewed_data= $1,
                is_finalized= $2,
                finalised_at= $3
            WHERE document_id= $4
            RETURNING *`,
            [reviewed_data, is_finalized, finalised_at, documentId]
        );

        if(result.rowCount==0){
            return res.status(404).json({message:'Result Not Found'});
        }

        res.status(200).json({message:'Result updated successfully', result: result.rows[0]});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};


