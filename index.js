import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMogoDB from './connections/mongoDB.js';
import userRoutes from './routes/users.js';
import newsRoutes from './routes/news.js';
import productRoutes from './routes/products.js';
import courseRoutes from './routes/courses.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const corsConfig = {
  origin: process.env.BASE_URL,
  credentials: true,
};
connectMogoDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/courses', courseRoutes);

app.get('/image', (req, res) => {
  console.log(req.files[0].buffer);
});
app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});
