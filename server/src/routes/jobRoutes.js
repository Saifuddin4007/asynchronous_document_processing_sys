import express from 'express';
import { getSingleJob } from '../controllers/jobControllers.js';

const router= express.Router();


// router.get('/jobs', getAllJobs); //in phase-3

router.get('/jobs/:documentId', getSingleJob);

// router.post('/jobs/:id/retry', retryJob); //in pahse-3




export default router;
