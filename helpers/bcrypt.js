import bcrypt from 'bcrypt';

// Returns a hash of the password.
export const bcryptingPassword = async (password) => {
  password = await bcrypt.hash(password, 12);
  return password;
};

// Compares a password against bcrypt.
export const passwordComparing = async (password, userPassword) => {
  const result = await bcrypt.compare(password, userPassword);
  return result;
};
