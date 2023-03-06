// Load models
const Post = require("../model/post.model");
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments");
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.send(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const post = new Post({ title, text, user: req.userId });
    await post.save();
    res.status(201).send({ post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
module.exports = {
  getAllPosts,
  getPostById,
  createPost,
};
