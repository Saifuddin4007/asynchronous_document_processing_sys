import fs from 'fs/promises';
import mammoth from 'mammoth';

export const docxAndDocProcessor = async (fileUrl)=>{
    const buffer= await fs.readFile(fileUrl);

    const result= await mammoth.extractRawText({buffer});

    let text= result.value;
    const metadata= result.messages; 

    text= text.trim();
    if(!text){
        throw new Error("doc/docx text extraction failed");
    }

    return {text, metadata};
}