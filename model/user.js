import mongoose from 'mongoose';
import validator from 'validator';
import gender from '../helpers/enum/gender.js';
import role from '../helpers/enum/role.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: [3, 'Username must be of minimum 3 characters'],
      required: [true, 'Please enter full Name'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Please enter email'],
      unique: [true, 'Email already exists'],
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address.');
        }
      },
    },
    phoneNumber: {
      type: Number,
      trim: true,
      unique: [true, 'Phone number already exists'],
      required: [true, 'Please enter phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: [8, 'Password must be of minimum 8 characters'],
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: 'https://banner2.cleanpng.com/20180703/ya/kisspng-computer-icons-user-avatar-user-5b3bafe2381423.1933594815306383062297.jpg',
    },
    gender: {
      type: String,
      enum: Object.values(gender),
      default: gender.PREFER_NOT_TO_SAY,
    },
    role: {
      type: String,
      enum: Object.values(role),
      default: role.USER,
    },
  },
  { timestamps: true },
);

userSchema.index({ username: 1, email: 1 });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
