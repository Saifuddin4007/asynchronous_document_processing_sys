



import { useRef, useState } from "react";

const UploadZone = ({
  handleUpload,
  handleFileSelect,
  handleRemoveFile,
  upload,
  selectedFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);

  const handleOnDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleOnDragLeave = () => {
    setIsDragging(false);
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const openFilePicker = () => {
    inputRef.current.click();
  };

  const handleRemove = () => {
    inputRef.current.value = "";
    handleRemoveFile();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`transition-all duration-300 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center bg-white shadow-sm
        ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300"
        }`}
        onDragOver={handleOnDragOver}
        onDragLeave={handleOnDragLeave}
        onDrop={handleOnDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) =>
            handleFileSelect(e.target.files[0])
          }
        />

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Document
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Drag & drop your PDF/DOC/DOCX file here
          </p>
        </div>

        <div className="flex gap-4 mt-8 flex-wrap justify-center">
          <button
            className="bg-gray-900 hover:bg-black transition text-white px-6 py-3 rounded-xl font-medium shadow-sm"
            onClick={openFilePicker}
          >
            Browse File
          </button>

          {selectedFile && (
            <button
              className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-xl font-medium shadow-sm"
              onClick={handleUpload}
              disabled={upload}
            >
              Upload
            </button>
          )}

          {selectedFile && (
            <button
              className="bg-red-100 hover:bg-red-200 transition text-red-700 px-6 py-3 rounded-xl font-medium shadow-sm"
              onClick={handleRemove}
              disabled={upload}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadZone;









