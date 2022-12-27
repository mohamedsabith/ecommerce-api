import express from 'express';
import { signupValidation, signInValidation, otpValidation } from '../../validator/authVlidator.js';
import { signup, signIn, otpVerification } from './controller.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);

router.post('/otp-verify', otpValidation, otpVerification);

router.post('/login', signInValidation, signIn);

export default router;
