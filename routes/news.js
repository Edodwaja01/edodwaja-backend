import express from 'express';
import { addNews, getAllNews } from '../controllers/news.js';
import { upload } from '../aws/index.js';
const router = express.Router();

router.post('/addNews', upload.single('image'), addNews);
router.get('/', upload.single('image'), getAllNews);

export default router;
