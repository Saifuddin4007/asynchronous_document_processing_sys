import { useRef, useState } from "react"
import FilePreview from "./FilePreview";



const UploadZone = ({handleUpload, handleFileSelect, handleRemoveFile, upload, selectedFile}) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef= useRef(null);

    const handleOnDragOver = (e)=>{
        e.preventDefault();
        setIsDragging(true);
    }

    const handleOnDragLeave = ()=>{
        setIsDragging(false);
    }

    const handleOnDrop = (e)=>{
        e.preventDefault();
        setIsDragging(false);

        const file= e.dataTransfer.files[0];
        handleFileSelect(file);


    }

    const openFilePicker = ()=>{
        inputRef.current.click();

    }

    const handleRemove = ()=>{
        inputRef.current.value= '';
        handleRemoveFile();
    }


  return (
    <>
    <div className={`flex justify-center items-center border-2 border-dashed ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`} onDragOver={handleOnDragOver} onDragLeave={handleOnDragLeave} onDrop={handleOnDrop}>
        <input ref={inputRef} type="file" className="hidden" onChange={(e)=>handleFileSelect(e.target.files[0])}/>
        <button className="bg-gray-300 px-1.5 py-0.5 mx-2 my-5 rounded-sm text-black" onClick={openFilePicker}>Browse File</button>
        <button className="bg-blue-500 px-3 py-1 mx-3 my-5 rounded-md text-black " onClick={handleUpload} disabled={upload}>Upload</button>
        <button className="bg-blue-500 px-3 py-1 mx-3 my-5 rounded-md text-black " onClick={handleRemove} disabled={upload}>Clear</button>
        
    </div> 
    <FilePreview selectedFile={selectedFile}/>
    </>
       
  )
}

export default UploadZone