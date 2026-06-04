


import FilePreview from "../components/FilePreview";
import UploadZone from "../components/UploadZone";
import useUpload from "../hooks/useUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const UploadPage = ({ onUploadComplete }) => {
  const {
    selectedFile,
    handleFileSelect,
    handleUpload,
    handleRemoveFile,
    upload,
    error,
  } = useUpload(onUploadComplete);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
            Smart Document Processor
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Upload your PDF or DOCX and extract text instantly
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <UploadZone
            handleFileSelect={handleFileSelect}
            handleUpload={handleUpload}
            handleRemoveFile={handleRemoveFile}
            upload={upload}
            selectedFile={selectedFile}
          />

          {upload && (
            <LoadingSpinner message="Uploading and processing document..." />
          )}

          {error && (
            <div className="mt-6">
              <ErrorMessage message={error} />
            </div>
          )}

          {selectedFile && (
            <FilePreview selectedFile={selectedFile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;









