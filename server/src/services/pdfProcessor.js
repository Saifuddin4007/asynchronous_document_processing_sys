import fs from 'fs/promises';
import { createRequire } from 'module';

const require= createRequire(import.meta.url);
const pdfParser= require('pdf-parse');

export const pdfProcessor= async (fileUrl)=>{
    const buffer= await fs.readFile(fileUrl);

    const result= await pdfParser(buffer);

    let text= result.text;
    const numPage= result.numpages;
    const metaData= result.info;

    text= text.trim();
    if(!text){
        throw new Error('pdf is scanned-pdf. text extraction failed');
    }

    return {text, numPage, metaData};

}

