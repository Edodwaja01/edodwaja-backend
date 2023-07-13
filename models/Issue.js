import mongoose from 'mongoose';
const issueSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const issueModal = mongoose.model('Issue', issueSchema);
export default issueModal;
