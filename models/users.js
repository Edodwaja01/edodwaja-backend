import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
      required: true,
    },
    institutionName: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 30,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      trim: true,
      maxlength: 3,
      // required: true,
    },
    domains: {
      type: [String],
      // required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  try {
    let token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '60d',
      }
    );
    return token;
  } catch (error) {
    console.log('Error while generating JWT', error);
  }
};
const userModal = mongoose.model('User', userSchema);
export default userModal;
