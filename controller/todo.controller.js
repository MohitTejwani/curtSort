// Load models
const Todo = require("../model/todo.model");
const getTodesByUserId = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.send(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({ title, description, user: req.userId });
    await todo.save();
    res.status(201).send({ todo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
const updatedAtTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    await todo.save();
    res.send({ todo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    await todo.remove();
    res.send("Todo deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  getTodesByUserId,
  createTodo,
  updatedAtTodo,
  deleteTodo,
};
