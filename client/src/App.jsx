import { useState } from "react"
import UploadPage from "./pages/UploadPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";



const App = () => {
  const [currentPage, setCurrentPage] = useState('upload');
  const [documentId, setDocumentId] = useState(null);
  const [results, setResults] = useState(null);


  // called by UploadPage when upload succeeds
  const handleUploadComplete = (docId)=>{
    setDocumentId(docId);
    setCurrentPage('processing');
  }

   // called by ProcessingPage when job completes
  const handleProcessingComplete = (results)=>{
    setResults(results);
    setCurrentPage('results');
  }

  return (
    <>
      {currentPage==='upload' && <UploadPage onUploadComplete={handleUploadComplete}/>}
      {currentPage==='processing' && <ProcessingPage documentId={documentId} onComplete={handleProcessingComplete}/>}
      {currentPage==='results' && <ResultPage results={results} documentId={documentId}/>}
    </>
  )
}

export default App