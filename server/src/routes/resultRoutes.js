import express from 'express';
import { getSingleResult, updateResult } from '../controllers/resultControllers.js';

const router= express.Router();

router.get('/:documentId', getSingleResult);

router.patch('/:documentId', updateResult);

// router.post('/results/:id/finalize', finalizeResult); //Need in future, in phase-3


export default router;