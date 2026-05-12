import multer from 'multer';
import path from 'path';

const storage= multer.diskStorage({
    //!Where to save this file
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    //!What to name the file
    filename: (req, file, cb) =>{
        const unique= `${Date.now()} - ${Math.round(Math.random()*1e9)}`;
        const ext= path.extname(file.originalname);
        cb(null,`${unique}${ext}`);
    }
});

const fileFilter= (req, file, cb) =>{
    const allowedTypes= [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Only pdf and word doc, docx are allowed'), false);
    }
}

export const upload= multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 10*1024*1024 //!MAX-10MB
    }
});