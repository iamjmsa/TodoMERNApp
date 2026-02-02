import express from "express";

const taskRouter = express.Router();
import {
  addTask,
  taskValidate,
  fetchTask,
  doneTask,
  editTask,
  updateTask,
  deleteTask,
  fetchAllCompleted,
  fetchAllTaskCalendar,
} from "../controller/taskController.js";

taskRouter.post("/task", taskValidate, addTask);
taskRouter.get("/allTask", fetchTask);
taskRouter.post("/done", doneTask);
taskRouter.get("/editTask/:id", editTask);
taskRouter.put("/updateTask", taskValidate, updateTask);
taskRouter.delete("/deleteTask", deleteTask);
taskRouter.get("/completed", fetchAllCompleted);
taskRouter.get("/calendar", fetchAllTaskCalendar);

export default taskRouter;
