



import { useState } from "react";

import UploadPage from "./pages/UploadPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import ReviewAndEdit from "./pages/ReviewAndEdit";

const App = () => {
  const [currentPage, setCurrentPage] =
    useState("upload");

  const [documentId, setDocumentId] =
    useState(null);

  const [results, setResults] =
    useState(null);

  // called by UploadPage when upload succeeds
  const handleUploadComplete = (docId) => {
    setDocumentId(docId);
    setCurrentPage("processing");
  };

  // called by ProcessingPage when job completes
  const handleProcessingComplete = (results) => {
    setResults(results);
    setCurrentPage("results");
  };

  // called by ResultPage when need to review/edit
  const handleReviewAndEdit = () => {
    setCurrentPage("review");
  };

  // reset app
  const handleAnotherDocProcess = () => {
    setResults(null);
    setDocumentId(null);
    setCurrentPage("upload");
  };

  // back to result page
  const handleGoBackToResult = () => {
    setCurrentPage("results");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {currentPage === "upload" && (
        <UploadPage
          onUploadComplete={handleUploadComplete}
        />
      )}

      {currentPage === "processing" && (
        <ProcessingPage
          documentId={documentId}
          onComplete={handleProcessingComplete}
        />
      )}

      {currentPage === "results" && (
        <ResultPage
          results={results}
          documentId={documentId}
          onReviewAndEdit={handleReviewAndEdit}
          onAnotherDocProcess={
            handleAnotherDocProcess
          }
        />
      )}

      {currentPage === "review" && (
        <ReviewAndEdit
          results={results}
          documentId={documentId}
          onBack={handleGoBackToResult}
        />
      )}
    </div>
  );
};

export default App;




