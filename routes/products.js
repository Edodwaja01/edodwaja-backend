import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProduct,
} from '../controllers/products.js';
import { upload } from '../aws/index.js';
const router = express.Router();
router.post('/addProduct', upload.array('images', 6), addProduct);
router.get('/', upload.array('images', 6), getAllProducts);
router.get('/:productId', upload.array('images', 6), getProduct);

export default router;
