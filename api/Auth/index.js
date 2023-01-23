import express from 'express';
import {
  signupValidation, signInValidation, otpValidation, forgotPasswordValidation, forgotPasswordOtpValidation,
} from '../../validator/authVlidator.js';
import {
  signup, signIn, otpVerification, forgotPassword, forgotPasswordOtpVerification,
} from './controller.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);

router.post('/otp-verify', otpValidation, otpVerification);

router.post('/login', signInValidation, signIn);

router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

router.post('/forgot-otp-verify', forgotPasswordOtpValidation, forgotPasswordOtpVerification);

export default router;
