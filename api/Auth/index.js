import express from 'express';
import signupValidation from '../../validator/authVlidator.js';
import signup from './controller.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);

export default router;
