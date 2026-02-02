import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import session from "express-session";
import connectMongoDB from "connect-mongo";

// * importing routers
import userRouter from "./router/userRouter.js";
import taskRouter from "./router/taskRouter.js";

const app = express();
const port = 3000;

const mongoDB =
  "mongodb+srv://jomermsanandres_db_user:IYhDqjTElaCUD64G@cluster0.gtgwrhf.mongodb.net/todoDB?appName=Cluster0";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
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
    secret: "session-key",
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
