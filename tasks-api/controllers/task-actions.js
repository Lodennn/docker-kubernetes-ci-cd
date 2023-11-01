const mongoose = require("mongoose");

const Task = require("../models/task");
const { createError } = require("../helpers/error");

const getTasks = async (req, res, next) => {
  console.log("GET TASKS API: req: ", JSON.stringify(req));
  console.log("GET TASKS API: ", req.userId);
  let tasks;

  try {
    tasks = await Task.find({ user: req.userId });
    console.log("GET TASKS API - TASKS: ", tasks);
  } catch (err) {
    const error = createError("Failed to fetch tasks.", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ tasks: tasks.map((task) => task.toObject({ getters: true })) });
};

const deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  console.log("DELETE TASKS API: ", req.params.id, "taskId: ", taskId);
  let task;
  try {
    task = await Task.findOne({ _id: taskId });
  } catch (err) {
    const error = createError("Failed to delete task.", 500);
    return next(error);
  }

  if (task.user.toString() !== req.userId) {
    const error = createError(
      "You are not authorized to delete this task.",
      403
    );
    return next(error);
  }

  try {
    await Task.deleteOne({ _id: taskId });
  } catch (err) {
    const error = createError("Failed to delete task.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Task deleted!" });
};

const createTask = async (req, res, next) => {
  console.log("CREATE TASKS API: ", req.userId);
  const title = req.body.title;
  const text = req.body.text;
  const newTask = new Task({
    title,
    text,
    user: mongoose.Types.ObjectId(req.userId),
  });
  console.log("CREATE TASKS API - newTask: ", newTask);

  let savedTask;

  try {
    savedTask = await newTask.save();
    console.log("CREATE TASKS API - savedTask: ", savedTask);
  } catch (err) {
    const error = createError("Failed to save task.", 500);
    return next(error);
  }

  res.status(201).json({ task: savedTask.toObject() });
};

exports.getTasks = getTasks;
exports.deleteTask = deleteTask;
exports.createTask = createTask;
