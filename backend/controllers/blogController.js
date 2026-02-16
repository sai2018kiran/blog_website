import Blog from '../models/Blog.js';

export const createBlog = async (req, res) => {
  const { title, content, image, topic, user } = req.body;

  if (!title || !content || !topic || !user) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newBlog = new Blog({ title, content, image, topic, user });
    await newBlog.save();
    console.log("Received blog data:", req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog.', error });
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs.', error });
  }
};

// Add this function to the bottom of the file
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({
      ...blog._doc,
      userName: blog.user?.name || "Unknown",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};



// Group blogs by topic
export const getBlogsByTopic = async (req, res) => {
  try {
    const blogs = await Blog.find();
    const grouped = blogs.reduce((acc, blog) => {
      if (!acc[blog.topic]) acc[blog.topic] = [];
      acc[blog.topic].push(blog);
      return acc;
    }, {});
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Failed to group blogs by topic.', error });
  }
};

// Get blogs grouped by topic
export const getBlogsGroupedByTopic = async (req, res) => {
  try {
    const blogs = await Blog.find();
    const grouped = {};

    blogs.forEach((blog) => {
      if (!grouped[blog.topic]) {
        grouped[blog.topic] = [];
      }
      grouped[blog.topic].push(blog);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Failed to group blogs by topic', error });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};


// Search Blogs
export const searchBlogs = async (req, res) => {
  const { keyword, topic } = req.query;

  const query = {};
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { content: { $regex: keyword, $options: "i" } },
    ];
  }
  if (topic) {
    query.topic = topic;
  }

  try {
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error searching blogs", error: err });
  }
};
