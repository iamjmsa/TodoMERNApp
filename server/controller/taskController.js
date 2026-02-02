import { body, validationResult } from "express-validator";
import Task from "../model/taskModel.js";

export const taskValidate = [
  body("task").notEmpty().withMessage("Task is required."),
  body("due").notEmpty().withMessage("Due Date is required"),
  body("importance").notEmpty().withMessage("Importance is required."),
];
export const addTask = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    const { userId, task, due, importance } = req.body;

    const taskAdded = await Task.create({
      userId: userId,
      task: task,
      due: due,
      importance: importance,
      status: "pending",
    });

    if (taskAdded) {
      res
        .status(200)
        .json({ success: true, message: "Task added successfully!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const fetchTask = async (req, res) => {
  try {
    const { id } = req.session.user;
    const data = await Task.find({ userId: id, status: "pending" });
    res.status(200).json({ success: true, task: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const doneTask = async (req, res) => {
  try {
    // console.log(req.body);
    const { id } = req.body;
    const status = "completed";

    const statusUpdated = await Task.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );

    if (statusUpdated) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Task.findOne({ _id: id, userId: req.session.user.id });
    if (data) {
      res.status(200).json({ success: true, task: data });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    const { id, task, due, importance } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: id },
      { task, due, importance },
      { new: true }
    );

    if (updatedTask) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { removeTaskId } = req.body;

    const deleted = await Task.findByIdAndDelete({ _id: removeTaskId });

    if (deleted) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const fetchAllCompleted = async (req, res) => {
  try {
    const { id } = req.session.user;
    const status = "completed";

    const data = await Task.find({ userId: id, status: status }).sort({
      due: -1,
    });

    if (data) {
      res.status(200).json({ success: true, completed: data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const fetchAllTaskCalendar = async (req, res) => {
  try {
    const { id } = req.session.user;
    const data = await Task.find({ userId: id });

    if (data) {
      res.status(200).json({ success: true, calendar: data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
