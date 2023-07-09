import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMogoDB from './connections/mongoDB.js';
import userRoutes from './routes/users.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const corsConfig = {
  origin: process.env.BASE_URL,
  credentials: true,
};
connectMogoDB();
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});
