import express from 'express';
import authRouter from '../api/Auth/index.js';

const router = express.Router();

router.use('/auth', authRouter);

export default router;
