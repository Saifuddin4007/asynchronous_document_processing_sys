import useJobStatus from "../hooks/useJobStatus";
import StatusBadge from "../components/StatusBadge";
import ProgressBar from "../components/ProgressBar";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect } from "react";


const ProcessingPage = ({documentId, onComplete}) => {
    const {status, progress, error, results} = useJobStatus(documentId);

    let message;
    if(status==='waiting'){
        message= "Your document is in queue";
    }
    else if(status==='active'){
        message="Extarcting texts from document";
    }
    else if(status==='completed'){
        message= "Processing complete";
    }
    else{
        message= error;
    }

    useEffect(()=>{
        if(status==='completed' && results){
            onComplete(results);
        }
    }, [status, results]);



  return (
    <>
        {status && <StatusBadge status={status}/>}
        {status && message}
        {progress !== null && <ProgressBar progress={progress}/>}
        {error && <ErrorMessage message={error}/>}
    </>
  )
}

export default ProcessingPage