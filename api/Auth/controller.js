import twilio from 'twilio';
import otpGenerator from 'otp-generator';
import { EmailVerifier } from 'simple-email-verifier';
import { createUser, getUserByEmail, getUserByNumber } from './service.js';
import { goodResponse, failedResponse } from '../../helpers/response.js';
import { bcryptingPassword, passwordComparing } from '../../helpers/bcrypt.js';
import creatingToken from '../../helpers/jwtToken.js';
import BadRequest from '../../helpers/exception/badRequest.js';
import transporter from '../../config/nodmailerConfig.js';

const {
  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ACCESS_JWT_TOKEN, REFRESH_JWT_TOKEN,
} = process.env;

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const verifier = new EmailVerifier(10000);

export const signup = async (req, res) => {
  const { email, phoneNumber } = req.body;
  // checking email already exist
  const mailExist = await getUserByEmail(email);

  if (mailExist) {
    throw new BadRequest('Another account is using this email.', 'EMAIL_EXISTS');
  }
  // checking number already exist
  const numberExist = await getUserByNumber(phoneNumber);
  if (numberExist) {
    throw new BadRequest('Another account is using this number.', 'NUMBER_EXISTS');
  }
  // email verification
  verifier
    .verify(email)
    .then((result) => {
      if (result) {
        // otp verification
        client.verify.v2
          .services(process.env.TWILIO_SERVICE_ID)
          .verifications.create({
            to: `+91${phoneNumber}`,
            channel: 'sms',
          })
          .then(({ status }) => res.json(goodResponse({ status, userDetails: req.body }, 'OTP Sent Successfully.')))
          .catch((err) => res.json(failedResponse(err)));
      } else {
        return res.json(failedResponse('Please enter valid email address'));
      }
    })
    .catch(() => res.json(failedResponse('Please try after some time.')));
};

// OTP VERIFICATION
export const otpVerification = (req, res) => {
  const {
    phoneNumber, email, fullName, password, otp,
  } = req.body;

  client.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      to: `+91${phoneNumber}`,
      code: otp,
    })
    .then(async (response) => {
      if (response.valid) {
        const hashedPassword = await bcryptingPassword(password);

        // saving to DB
        const newUser = await createUser({
          phoneNumber,
          email,
          fullName,
          hashedPassword,
        });

        const accessToken = await creatingToken(newUser.email, newUser._id, ACCESS_JWT_TOKEN, '1d');
        const refreshToken = await creatingToken(newUser.email, newUser._id, REFRESH_JWT_TOKEN, '2d');

        return res.json(goodResponse({ accessToken, refreshToken, newUser }, 'New User Created Successfully'));
      }
      return res.json(failedResponse('Failed to authenticate invalid otp', 401, 'Invalid otp'));
    })
    .catch((err) => res.json(failedResponse(err, 401, 'Please try after sometime')));
};

// Verify a user.
export const signIn = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  // Get a user by email or phone number.
  const isUser = email ? await getUserByEmail(email) : await getUserByNumber(phoneNumber);
  // Throws an error if the user is not found
  if (!isUser) throw new Error('User not found');
  // Verify a bcrypt password.
  const decryptPassword = await passwordComparing(password, isUser.password);
  // Throws an error if password is invalid.
  if (!decryptPassword) throw new Error('Incorrect password');

  const accessToken = await creatingToken(isUser.email, isUser._id, ACCESS_JWT_TOKEN, '1d');
  const refreshToken = await creatingToken(isUser.email, isUser._id, REFRESH_JWT_TOKEN, '2d');

  return res.json(goodResponse({ accessToken, refreshToken, isUser }, 'successfully logined'));
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new BadRequest('The email you entered does not belong to an account. Please check your email and try again.');
  }

  const otp = otpGenerator.generate(8, { upperCaseAlphabets: true, specialChars: false });

  const mailData = {
    from: process.env.GOOGLE_APP_EMAIL, // sender address
    to: email, // list of receivers
    subject: `${otp} is your msb account recovery code`,
    html: `<p>Hey ${user.fullName}!</p> 
      <p> We received a request to reset your password. Enter the following password reset code: </p>
      <p> Use your secret code!</p>
      <button style="background-color: #fff;border-radius: 10px;border-color: #3630a3;color:#000000;height: 60px;width: 120px; font-weight: 900;">${otp}</button>
      <br><p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset otp is only valid for the next 10 minutes. </p>`,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      throw new BadRequest(err);
    }
    return res.json(goodResponse({ info }, 'Message sent successfully'));
  });
};
