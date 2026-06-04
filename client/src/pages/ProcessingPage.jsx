


import useJobStatus from "../hooks/useJobStatus";
import StatusBadge from "../components/StatusBadge";
import ProgressBar from "../components/ProgressBar";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const ProcessingPage = ({ documentId, onComplete }) => {
  const [showCompletionState, setShowCompletionState] =
    useState(false);

  const { status, progress, error, results } =
    useJobStatus(documentId);

  let message;
  if(error){
    message= error;
  }
  else if (status === "queued") {
    message = "Your document is waiting in queue";
  } else if (status === "processing") {
    message = "Extracting text from document...";
  } else if (status === "completed") {
    message = showCompletionState
      ? "Opening results..."
      : "Processing complete";
  } else if (status === "retrying") {
    message = "Retrying document processing...";
  } else {
    message = error;
  }

  useEffect(() => {
    if (status === "completed" && results) {
      setShowCompletionState(true);

      const timer = setTimeout(() => {
        onComplete(results);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [status, results]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 p-10">
        <div className="flex flex-col items-center text-center">

          {status && !error && (
            
            <StatusBadge status={status} />

          )}

          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Document Processing
          </h2>

          <p className="mt-3 text-gray-500 text-sm">
            {message}
          </p>

          <div className="w-full mt-8">
            {!error && progress !== null && (
              <ProgressBar progress={progress} />
            )}
          </div>

          <div className="mt-6">
            {!error && status !== "completed" && (
              <LoadingSpinner />
            )}
          </div>

          {error && (
            <div className="mt-6 w-full">
              <ErrorMessage message={error} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;




