import product from '../models/ecommerce/products.js';
import { uploadToS3 } from '../aws/index.js';
export const addProduct = async (req, res) => {
  const { title, description, specifications, price, stock } = req.body;
  let imagesUploaded = [];
  if (!title) res.status(400).json({ message: 'Title should not be empty' });
  if (!description)
    res.status(400).json({ message: 'Description should not be empty' });
  if (!specifications)
    res.status(400).json({ message: 'Specifications should not be empty' });
  if (!price) res.status(400).json({ message: 'Price should not be empty' });

  const files = req.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const uploadPromises = files.map((file) => {
        return uploadToS3(
          file.buffer,
          `product/${title
            .toLowerCase()
            .replace(/ /g, '-')
            .substring(0, 25)}/${Date.now().toString()}.jpg`
        );
      });

      const uploadResults = await Promise.all(uploadPromises);
      imagesUploaded = uploadResults.map((data) => data.Location.toString());
    }
  } else {
    res.status(400).json({ message: 'there must be atleast 1 image' });
  }

  try {
    const newProduct = new product({
      title,
      description,
      specifications,
      price,
      stock,
      images: imagesUploaded,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId)
    return res.status(400).json({ message: 'Product Id Should not be Empty' });

  try {
    const requestedProduct = await product.find({ _id: productId });
    res.status(200).json({ product: requestedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await product.find({});
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
