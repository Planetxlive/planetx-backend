const express = require("express");
const { createBlog, updateBlog, deleteBlog, getBlogById, getBlogs, getBlogdByUserId } = require("../controllers/blogController/blogController");
const blogRouter = express.Router();

console.log(getBlogdByUserId)

blogRouter.post("/create", createBlog );
blogRouter.get("/get", getBlogs);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/delete/:id", deleteBlog);
blogRouter.get("/get/:id", getBlogById);
blogRouter.get("/get-user", getBlogdByUserId);
module.exports = blogRouter; 