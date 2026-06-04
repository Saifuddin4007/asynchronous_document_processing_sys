import { useEffect, useRef, useState } from "react";
import { getJobStatus, getResults } from "../services/api";


const useJobStatus = (documentId) => {
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [displayedStatus, setDisplayedStatus]= useState('queued');
    const [displayedProgress, setDisplayedProgress]= useState(0);

    const intervalRef = useRef(null);
    const pollCountRef= useRef(0);

    const processingStartTimeRef = useRef(null);


    // const runVisualStages= async ()=>{
    //     //stage1
    //     setDisplayedStatus('queued');
    //     setDisplayedProgress(30);

    //     await new Promise(resolve =>
    //         setTimeout(resolve, 400)
    //     );

    //     //stag2
    //     setDisplayedStatus('processing');
    //     setDisplayedProgress(60);

    //     await new Promise(resolve=>
    //         setTimeout(resolve, 700)
    //     );

    //     //stage3
    //     setDisplayedStatus('completed');
    //     setDisplayedProgress(100);
    // }

    const polling = async () => {
        try {
            pollCountRef.current+=1;
            const res = await getJobStatus(documentId);
            setStatus(res.job.status);
            setProgress(prev => Math.max(prev, res.job.progress_percent));
            

            if(pollCountRef.current > 100){
                clearInterval(intervalRef.current);

                setError("Processing timeout. Invalid or corrupted document");
            }

            if (res.job.status === 'completed') {

                //how long UI has been showing
                const elapsed = Date.now() - processingStartTimeRef.current;

                //minimum time processing page should stay visible
                const MIN_UI_DURATION = 1500;


                //if backend completed too quickly
                //wait remainign time for smoother UX
                if (elapsed < MIN_UI_DURATION) {
                    await new Promise(resolve =>
                        setTimeout(
                            resolve,
                            MIN_UI_DURATION - elapsed
                        )
                    );
                }


                const result = await getResults(documentId);
                

                setDisplayedStatus('completed');
                setDisplayedProgress(100);
                setProgress(100);

                const validStatuses= [
                    'queued', 
                    'processing',
                    'completed',
                    'failed',
                    'retrying' 
                ];

                if(!validStatuses.includes(res.job.status)){
                    clearInterval(intervalRef.current);

                    setError("Unknown processing state");

                    setStatus('failed');

                    return;
                }
                // await runVisualStages();
                setResults(result.result);
                clearInterval(intervalRef.current);
            }

            if (res.job.status === 'failed') {
                clearInterval(intervalRef.current);
                setError('Document processing failed');

            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Something went wrong. Please try again.');
            clearInterval(intervalRef.current);
        }

    }

    useEffect(() => {

        processingStartTimeRef.current = Date.now();


        if (!documentId) {
            console.log('documentId is null, polling not starting');
            return;
        };
        intervalRef.current = setInterval(polling, 500);

        return () => {

            clearInterval(intervalRef.current);

        }
    }, [documentId]);



    useEffect(()=>{
        // stage1
        setDisplayedStatus('queued');
        setDisplayedProgress(25);

        const processingTimer= setTimeout(()=>{
            // stage2
            setDisplayedStatus('processing');
            setDisplayedProgress(65);
        }, 500);

        return ()=> clearTimeout(processingTimer);
    }, []);

    return {
        status: displayedStatus,
        progress: displayedProgress,
        error,
        results
    }

}

export default useJobStatus