

const FilePreview = ({selectedFile}) => {
  return (
    <div className="flex justify-center">
        {
            selectedFile && <p className="text-sm text-gray-400 ">{selectedFile.name}{(selectedFile.size/(1024 * 1024)).toFixed(2)} MB</p>
            
        }
    </div>
  )
}

export default FilePreview