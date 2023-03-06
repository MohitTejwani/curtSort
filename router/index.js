const todoController = require("../controller/todo.controller");
const userController = require("../controller/user.controller");
const postController = require("../controller/post.controller");
const commentController = require("../controller/comment.controller");
const verifyToken = require("../middleware/auth");
const express = require("express");
const routes = express.Router();

routes.post("/signup", userController.signup);
routes.post("/login", userController.login);

routes.get("/todos", verifyToken, todoController.getTodesByUserId);
routes.post("todos", verifyToken, todoController.createTodo);
routes.put("/todos/:id", verifyToken, todoController.updatedAtTodo);
routes.delete("/todos/:id", verifyToken, todoController.deleteTodo);

routes.get("/posts", postController.getAllPosts);
routes.get("/posts/:id", postController.getPostById);
routes.post("/posts",verifyToken, postController.createPost);

routes.get("/posts/:id/comments",verifyToken, commentController.addComentOnPost);
routes.get("/users/:id", verifyToken, userController.getUserById);

module.exports = routes;
