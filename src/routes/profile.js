const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { profileEditValidation } = require("../helper/validation");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!profileEditValidation(req)) {
      return res.status(400).send("invalid Edit request");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();
    res.send(`${loggedUser.firstName}, your profile updated`);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    user.password = req.body.password;
    await user.save();
    res.json({
      message: `${user.firstName}, your password changed successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
