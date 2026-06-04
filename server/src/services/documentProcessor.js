import { docxAndDocProcessor } from "./docxAndDocProcessor.js";
import { pdfProcessor } from "./pdfProcessor.js";
import path from 'path';

export const documentProcessor= async (storedFilename, mimeType)=>{
    const fileUrl= path.join(process.cwd(), 'uploads', storedFilename);
    if(mimeType=== 'application/pdf'){
        return await pdfProcessor(fileUrl);
    }

    if(mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        return await docxAndDocProcessor(fileUrl);
    }

    throw new Error('Unsupported file type');
        
}