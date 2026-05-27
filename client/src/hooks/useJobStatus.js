import { useEffect, useRef, useState } from "react";
import { getJobStatus, getResults } from "../services/api";


const useJobStatus = (documentId) => {
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const intervalRef= useRef(null);



    const polling = async () => {
        try {
            const res = await getJobStatus(documentId);
            setStatus(res.status);
            setProgress(res.progress_percent);

            if (res.status === 'completed') {
                const result = await getResults(documentId);
                setResults(result);
                clearInterval(intervalRef.current);
            }

            if(res.status==='failed'){
                clearInterval(intervalRef.current);
                setError('Document processing failed');

            }
        } catch (err) {
            console.log(err);
            setError(err);
        }

    }

    useEffect(() => {
        if(!documentId) return;
        intervalRef.current = setInterval(polling, 3000);

        return () => {

            clearInterval(intervalRef.current);

        }
    }, [documentId]);

    return {
        status,
        progress,
        error,
        results
    }

}

export default useJobStatus