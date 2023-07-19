import { uploadToS3 } from '../aws/index.js';
import news from '../models/news.js';

export const addNews = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  if (!title) res.status(400).json({ message: 'Title is required' });
  if (!file) res.status(400).json({ message: 'Image is required' });
  if (!description)
    res.status(400).json({ message: 'description is required' });
  uploadToS3(file.buffer, `news/${Date.now().toString()}.jpg`)
    .then((data) => {
      const addednews = new news({
        title,
        image: data.Location,
        description,
      });
      addednews.save();
      return res.status(201).json({ message: 'News Added' });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

export const getAllNews = async (req, res) => {
  try {
    const allNews = await news.find({});
    res.status(200).json({ news: allNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  const { newsId } = req.params;
  try {
    const selectedNews = await news.findOne({ _id: newsId });
    res.status(200).json({ news: selectedNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
