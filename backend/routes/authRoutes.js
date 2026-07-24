import express from 'express';
import { getUser, login, register } from '../controllers/UserController.js';
import { authtoken } from '../middleware/auth.js';

const Userrouter = express.Router();

Userrouter.post('/register', register);
Userrouter.post('/login', login);
Userrouter.get('/me',authtoken , getUser);

export default Userrouter;