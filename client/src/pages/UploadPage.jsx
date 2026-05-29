import FilePreview from "../components/FilePreview";
import UploadZone from "../components/UploadZone";
import useUpload from "../hooks/useUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
const UploadPage = ({onUploadComplete}) => {
    const {selectedFile, handleFileSelect, handleUpload, handleRemoveFile, upload, error} = useUpload(onUploadComplete);

  return (
    <>
        <UploadZone handleFileSelect={handleFileSelect} handleUpload={handleUpload} handleRemoveFile={handleRemoveFile} upload={upload} selectedFile={selectedFile} />
        {upload && <LoadingSpinner message="Document is uploading" /> }
        {error && <ErrorMessage message={error}/>}
        {selectedFile && <FilePreview selectedFile={selectedFile} />}
    </>
  )
}

export default UploadPage