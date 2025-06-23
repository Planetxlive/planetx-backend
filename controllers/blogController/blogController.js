const Blog = require("../../modals/Blog");
const User = require("../../modals/Users");

const createBlog = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { title, category, description, location, image, contactInfo } =
    req.body;

  if (!title || !category || !description || !contactInfo || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const blog = new Blog({
      userId,
      title,
      category,
      description,
      location,
      image,
      contactInfo,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { blogs: blog._id } },
      { new: true } // Return updated document (optional)
    );
    await blog.save();

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};

const updateBlog = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ error: "Blog ID is required" });
  }

  const { title, category, description, image, location, contactInfo } =
    req.body;
  if (!title || !category || !description || !contactInfo || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this blog" });
    }
    blog.title = title;
    blog.category = category;
    blog.description = description;
    blog.image = image !== undefined ? image : blog.image;
    blog.location = location;
    blog.contactInfo = contactInfo;
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

const deleteBlog = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ error: "Blog ID is required" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }
    await blog.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { blogs: blogId } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

const getBlogById = async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ error: "Blog ID is required" });
  }
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: "Failed to get blog" });
  }
};

const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json({ error: "Page and limit must be positive integers" });
  }

  const skip = (page - 1) * limit;
  const total = await Blog.countDocuments();
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  try {
    const blogs = await Blog.find().skip(skip).limit(limit);
    res.status(200).json({ blogs, totalPages, hasNextPage, hasPrevPage });
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogs" });
  }
};

const getBlogdByUserId = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const blogs = await Blog.find({ userId: userId });
    res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  getBlogdByUserId,
};
