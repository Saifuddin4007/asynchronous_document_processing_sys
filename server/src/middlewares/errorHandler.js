export const errorHandler= (err, req, res, next) =>{
    //!Multer specific errors
    if(err.code==='LIMIT_FILE_SIZE'){
        return res.status(400).json({error: 'file too large, maximum size 10 MB'});
    }

    if(err.message==='Only pdf and word doc, docx are allowed'){
        return res.status(400).json({error: err.message});
    }

    res.status(err.status || 500).json({error: err.message});
}