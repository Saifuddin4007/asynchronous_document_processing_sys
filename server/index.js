import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/db/pool.js';
import {errorHandler} from '../server/src/middlewares/errorHandler.js';
import documentRoutes from './src/routes/documentRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import resultRoutes from './src/routes/resultRoutes.js';
import exportRoutes from './src/routes/exportRoutes.js';
const app= express();


dotenv.config();



const PORT= process.env.PORT || 7001;

//!express-middleware
app.use(express.json());


//!CORS
app.use(cors({
    origin: 'http://localhost:4173', // your React app's exact origin
    credentials: true,               // required because axios has withCredentials: true
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));


//!Routes
app.use('/api/v1', documentRoutes);
app.use('/api/v1', jobRoutes);
app.use('/api/v1', resultRoutes);
app.use('/api/v1', exportRoutes);


//!Always last
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is started at PORT: ${PORT}`);
})