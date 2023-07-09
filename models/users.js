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
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minLength: 6,
    // },
    phoneNumber: {
      type: Number,
      // required: true,
      trim: true,
    },
    institutionName: {
      type: String,
      trim: true,
      // required: true,
      maxlength: 100,
    },
    class: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    domains: [String],
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
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });
const userModal = mongoose.model('User', userSchema);
export default userModal;
