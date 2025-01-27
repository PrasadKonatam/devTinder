const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { signupValidation } = require("./helper/validation");
const bcrypt = require("bcrypt");

// const { adminAuth } = require("./middlewares/auth");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not Exists");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      res.send("User Loggin successfully");
    } else {
      throw new Error("password is not correct");
    }
  } catch (error) {
    res.status(500).send("Error saving user data: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const AllowedUpadates = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      AllowedUpadates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("This update not allowed");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.send("User updated");
  } catch (err) {
    res.status(400).send("Update Failed :" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("server running");
    });
  })
  .catch((err) => {
    console.error("Error while connecting DB");
  });
