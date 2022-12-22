import UserModel from '../../model/user.js';

export const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

export const getUserByNumber = async (phoneNumber) => {
  const user = await UserModel.findOne({ phoneNumber });
  return user;
};
