import { useState } from "react"
import { uploadDocument } from "../services/api";


const useUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [upload, setUpload] = useState(false);
    const [error, setError] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [jobId, setJobId] = useState(null); 

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const handleFileSelect = (file) => {
        if (!allowedTypes.includes(file.type)) {
            return setError("File type isn't pdf nor doc, docx");
        }

        if (file.size > 10 * 1024 * 1024) {
            return setError("Size is more than 10 MB");
        }

        setError(null);
        setSelectedFile(file)
    }


    const handleUpload= async ()=>{
       try{
         setUpload(true);

        const res = await uploadDocument(selectedFile);

        setDocumentId(res.document_id);
        setJobId(res.jobId);

        setUpload(false);

       }catch(err){
        setError(err.message);
        setUpload(false);
       }

    }


    const handleRemoveFile = ()=>{
        setSelectedFile(null);
        setError(null);
    }

    return {
        selectedFile,
        upload,
        error,
        documentId,
        jobId,
        handleFileSelect,
        handleUpload,
        handleRemoveFile
    };

}

export default useUpload;