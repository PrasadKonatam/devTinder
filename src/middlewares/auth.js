const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const decoded = jwt.verify(token, "prasad@DevTinder");
    const { _id } = decoded;
    console.log("Logged User is " + _id);
    const user = await User.findById(_id);
    if (!user) {
      res.status(400);
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
