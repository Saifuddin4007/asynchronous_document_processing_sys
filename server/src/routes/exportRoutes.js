import express from 'express';
import { exportDocument } from '../controllers/exportController.js';

const router= express.Router();

router.get('/export/:documentId', exportDocument);




export default router;