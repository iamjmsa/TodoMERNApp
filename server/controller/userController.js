import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";

export const userAuth = async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).json({ success: true, user: req.session.user });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginValidate = [
  body("email")
    .notEmpty()
    .withMessage("Email Address is empty.")
    .bail()
    .isEmail()
    .withMessage("Email Address is invalid."),
  body("password").notEmpty().withMessage("Password is empty."),
];

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: [
          { path: "invalid", msg: "Invalid information. Please try again." },
        ],
      });
    }

    // * password hashed
    const passwordMatch = await bcrypt.compare(password, user.password); // * entered password and user.password from db

    if (passwordMatch) {
      req.session.user = {
        id: user._id,
        fullname: user.fullname,
      };
      res.status(200).json({ success: true, redirect: "/home" });
    } else {
      res.status(400).json({
        success: false,
        message: [{ path: "invalid", msg: "E-mail or Password is incorrect." }],
      });
    }
    // ! password is not decrypt
    // if (user.password === password) {
    //   res.status(200).json({ success: true, redirect: "/home" });
    // } else {
    //   return res.status(400).json({
    //     success: false,
    //     message: [{ path: "invalid", msg: "E-mail or Password is incorrect." }],
    //   });
    // }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.session.destroy) {
      res.clearCookie("todo.sid", { path: "/" });
      res.status(200).json({ success: true, redirect: "/" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const registerValidate = [
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required.")
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Only letters and whitespace are allowed."),
  body("email")
    .notEmpty()
    .withMessage("E-mail Address is required.")
    .bail()
    .isEmail()
    .withMessage("E-mail Address is invalid.")
    // todo: validation checking if already exist
    .custom(async (email) => {
      const emailExist = await User.findOne({ email: email });

      if (emailExist) {
        return Promise.reject("E-mail Address is already taken.");
      }
    }),
  body("password").notEmpty().withMessage("Password is required."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required.")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm Password did not matched."),
];

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);

    const registerSuccess = await User.create({
      fullname: fullname,
      email: email,
      password: passwordHashed,
    });

    if (registerSuccess) {
      res.status(200).json({ success: true, redirect: "/" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
