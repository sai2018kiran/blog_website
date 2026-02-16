import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByTopic,
  updateBlog,
  deleteBlog,
  searchBlogs,
} from '../controllers/blogController.js';

import { protect } from '../middleware/authMiddleware.js'; // ⬅️ Import this

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/topics', getBlogsByTopic);
// Place this first
router.get("/search", searchBlogs);

// THEN this
router.get("/:id", getBlogById);


// Protected routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);     // ✅ Secure update
router.delete('/:id', protect, deleteBlog);  // ✅ Secure delete

export default router;
