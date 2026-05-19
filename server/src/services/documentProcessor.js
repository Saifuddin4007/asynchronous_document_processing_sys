import { pdfProcessor } from "./pdfProcessor.js";
import path from 'path';

export const documentProcessor= async (storedFilename, mimeType)=>{
    const fileUrl= path.join(process.cwd(), 'uploads', storedFilename);
    console.log(storedFilename)
    if(mimeType=== 'application/pdf'){
        return await pdfProcessor(fileUrl);
    }

    throw new Error('Unsupported file type');
        
}