const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const { signupValidation } = require("../helper/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User data Entered successfully");
  } catch (error) {
    res.status(500).send("Error saving user data: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not Exists");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "prasad@DevTinder");

      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("password is not correct");
    }
  } catch (error) {
    res.status(500).send("Error saving user data: " + error.message);
  }
});

authRouter.post("/logout", userAuth, (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.send("not logged in");
  }

  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
