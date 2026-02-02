import express from "express";

const userRouter = express.Router();

import {
  userAuth,
  login,
  loginValidate,
  logout,
  registerValidate,
  register,
} from "../controller/userController.js";

userRouter.get("/auth", userAuth);
userRouter.post("/login", loginValidate, login);
userRouter.post("/register", registerValidate, register);
userRouter.post("/logout", logout);

export default userRouter;
