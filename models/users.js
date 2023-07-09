import mongoose from 'mongoose';
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
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    institutionName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    class: {
      type: String,
      required: true,
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
const userModal = mongoose.model('User', userSchema);
export default userModal;
