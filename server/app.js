import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import session from "express-session";
import connectMongoDB from "connect-mongo";

// * importing routers
import userRouter from "./router/userRouter.js";
import taskRouter from "./router/taskRouter.js";

const app = express();
dotenv.config();
const port = process.env.PORT;

const mongoDB = process.env.MONGODB_URL;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const mongoDBSession = connectMongoDB.create({
  mongoUrl: mongoDB,
  collectionName: "session",
});

app.use(
  session({
    name: "todo.sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: mongoDBSession,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

mongoose
  .connect(mongoDB)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on [http://localhost:${port}]`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

app.use("/", userRouter);
app.use("/", taskRouter);
