import mongoose from 'mongoose';

export default function () {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDB Conneted');
  } catch (error) {
    console.log('MongoDB Connection error ' + error);
  }
}
