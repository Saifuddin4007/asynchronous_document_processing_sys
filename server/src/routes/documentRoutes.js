import express from 'express';
import {upload} from '../middlewares/upload.js';
import { checkHealth, deleteOneDocument, getAllDocuments, getSingleDocument, uploadDocument } from '../controllers/documentControllers.js';

const router= express.Router();

router.get('/health', checkHealth);

router.post('/upload', upload.single('file'), uploadDocument); //!UPLOAD DOCUMENT

router.get('/', getAllDocuments);

router.get('/:id', getSingleDocument);

router.delete('/:id', deleteOneDocument);

export default router;