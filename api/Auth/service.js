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
