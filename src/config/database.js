const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://prasadkonatam96:prasadDevTinder@cluster0.yoqa6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = { connectDB };