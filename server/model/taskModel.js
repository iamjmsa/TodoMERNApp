import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  due: {
    type: String,
    required: true,
  },
  importance: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
