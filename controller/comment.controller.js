// Load models
const Post = require("../model/post.model");
const Comment = require("../model/comment.model");
const addComentOnPost = async (req, res) => {
  try {
    console.log(req.body, req.params.id, req.userId);
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const comment = new Comment({
      body: text,
      post: req.params.id,
      user: req.userId,
    });
    await comment.save();
    await Post.updateOne(
      { _id: req.params.id },
      { $push: { comments: comment._id } }
    ),
      res.status(201).send({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  addComentOnPost,
};
