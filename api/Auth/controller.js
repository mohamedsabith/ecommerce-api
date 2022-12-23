import twilio from 'twilio';
import { getUserByEmail, getUserByNumber } from './service.js';
import { goodResponse, failedResponse } from '../../helpers/response.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const signup = async (req, res) => {
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

export default signup;
