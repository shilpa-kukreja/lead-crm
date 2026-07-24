import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import Userrouter from './routes/authRoutes.js';
import leadrouter from './routes/leadRoutes.js';


connectDB();

const app = express();
app.use(cors());
app.use(express.json());
 
// Routes
app.use('/api/auth', Userrouter);
app.use('/api/leads', leadrouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));