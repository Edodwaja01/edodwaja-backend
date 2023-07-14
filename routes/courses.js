import express from 'express';
import course from '../models/courses/courses.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const getCourse = await course.find({});
  return res.send(getCourse);
});
export default router;
