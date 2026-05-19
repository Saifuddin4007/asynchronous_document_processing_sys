import pool from '../db/pool.js'; 


export const getSingleJob= async (req,res)=>{
    try{
        const {documentId}= req.params;

        const jobResult= await pool.query(
            `SELECT
                status,
                progress_percent,
                attempt_number,
                started_at,
                completed_at
            FROM jobs
            WHERE document_id= $1`,
            [documentId]
        );

        if(jobResult.rowCount==0){
            return res.status(404).json({message:'Job not found'});
        }

        res.status(200).json({message:'Your job', job: jobResult.rows[0]});

    }catch(err){
        res.status(500).json({message: err.message});

    }
}