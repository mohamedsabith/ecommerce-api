import twilio from 'twilio';
import { createUser, getUserByEmail, getUserByNumber } from './service.js';
import { goodResponse, failedResponse } from '../../helpers/response.js';
import { bcryptingPassword, passwordComparing } from '../../helpers/bcrypt.js';
import creatingToken from '../../helpers/jwtToken.js';

const {
  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ACCESS_JWT_TOKEN, REFRESH_JWT_TOKEN,
} = process.env;

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const signup = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    // checking user already exist
    const mailExist = await getUserByEmail(email);
    // checking email already exist
    if (mailExist) {
      return res.json(failedResponse('Another account is using this email.'));
    }
    // checking number already exist
    const numberExist = await getUserByNumber(phoneNumber);
    if (numberExist) {
      return res.json(failedResponse('Another account is using this number.'));
    }

    client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: 'sms',
      }).then(({ status }) => res.json(goodResponse({ status, userDetails: req.body }, 'OTP Sent Successfully.'))).catch((error) => res.json(failedResponse(error)));
  } catch (error) {
    return res.json(failedResponse(error.message));
  }
};

// OTP VERIFICATION
export const otpVerification = (req, res) => {
  try {
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
  } catch (error) {
    return res.json(failedResponse(error));
  }
};
