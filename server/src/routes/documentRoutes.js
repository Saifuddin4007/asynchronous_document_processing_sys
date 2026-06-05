import express from 'express';
import {upload} from '../middlewares/upload.js';
import { checkHealth, deleteOneDocument, getAllDocuments, getSingleDocument, uploadDocument } from '../controllers/documentControllers.js';

const router= express.Router();

router.get('/health', checkHealth);

router.post('/documents/upload', upload.single('file'), uploadDocument); //!UPLOAD DOCUMENT

router.get('/documents', getAllDocuments);

router.get('/documents/:id', getSingleDocument);

router.delete('/documents/:id', deleteOneDocument);

export default router;