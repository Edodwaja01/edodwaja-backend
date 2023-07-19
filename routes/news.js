import express from 'express';
import { addNews, getAllNews, getNewsById } from '../controllers/news.js';
import { upload } from '../aws/index.js';
const router = express.Router();

router.post('/addNews', upload.single('image'), addNews);
router.get('/', getAllNews);
router.get('/:newsId', getNewsById);

export default router;
