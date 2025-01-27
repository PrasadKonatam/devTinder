const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true, minLength: 4 },
    lastName: { type: String },
    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, require: true },
    age: {
      type: Number,
      require: true,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Enter valid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    about: {
      type: String,
      default: "This is default about of the user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("only 10 skills are allowed");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
