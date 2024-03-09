const Task = require("../models/task.Schema");
const mongoose = require("mongoose");

const getTasks = async (req, res) => {
  const user_id = req.user._id;

  const tasks = await Task.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(tasks);
};

const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No task with id: ${id}` });
  }

  const task = await Task.findById({ _id: id });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
};

const createTask = async (req, res) => {
  const { title, description, completed, endDate } = req.body;

  let emplyFields = [];

  if (!title) {
    emplyFields.push("Title");
  }
  if (emplyFields.length > 0) {
    return res.status(400).json({ message: `Title field is required` });
  }

  try {
    const user_id = req.user._id;

    const task = await Task.create({
      title,
      description,
      completed,
      endDate,
      user_id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No task with id: ${id}` });
  }

  const task = await Task.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No task with id: ${id}` });
  }

  const task = await Task.findOneAndDelete({ _id: id });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
