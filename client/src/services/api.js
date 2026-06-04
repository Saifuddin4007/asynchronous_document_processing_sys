import axios from 'axios';

const api= axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const uploadDocument= async (file)=>{
    const formData= new FormData();
    formData.append('file', file);

    const res= await api.post('/api/v1/documents/upload', formData);
    return res.data;
}

export const getJobStatus= async (documentId)=>{
    const res= await api.get(`/api/v1/jobs/${documentId}`);
    return res.data;
}

export const getResults= async (documentId)=>{
    const res= await api.get(`/api/v1/results/${documentId}`);
    return res.data;
} 

export const saveReviewedData= async (docId, reviewedData, isFinalized=false)=>{
    const res= await api.patch(`/api/v1/results/${docId}`, {
        reviewed_data: reviewedData,
        is_finalized: isFinalized
    });
    return res.data;
}


export const exportData= async (documentId, format)=>{
    const res= await api.get(`/api/v1/export/${documentId}?format=${format}`,
        {
            responseType: 'blob'
        }
    );
    return res;
}