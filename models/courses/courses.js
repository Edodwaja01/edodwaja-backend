import mongoose from 'mongoose';
const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trime: true,
    maxLength: 100,
  },
  lectures: [lectureSchema],
});
const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
    maxlength: 500,
  },
});
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    sections: [sectionSchema],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    ratings: [ratingSchema],
  },
  {
    timestamps: true,
  }
);

const courseModal = mongoose.model('Course', courseSchema);
export default courseModal;
