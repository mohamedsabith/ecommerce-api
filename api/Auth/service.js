import UserModel from '../../model/user.js';

export const createUser = async ({
  email, phoneNumber, fullName, hashedPassword,
}) => {
  const newUser = new UserModel({
    email,
    phoneNumber,
    fullName,
    password: hashedPassword,
  });
  const response = await newUser.save();
  return response;
};

export const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

export const getUserByNumber = async (phoneNumber) => {
  const user = await UserModel.findOne({ phoneNumber });
  return user;
};


export const otpDetailsSaving = async (otp, otpExpireTime, otpLastSent, otpSentCount) => {
  const otpDetails = await UserModel.updateMany({
    otp, otpExpireTime, otpLastSent, otpSentCount,
  });
  return otpDetails;
};

export const otpCountReset = async () => {
  const otpReset = await UserModel.updateOne({
    otpSentCount: 0,
  });
  return otpReset;
};
