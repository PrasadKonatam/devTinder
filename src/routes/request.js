const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const senderUserId = req.user._id;
      const recieverUserId = req.params.toUserId;
      const status = req.params.status;

      const recieverUser = await User.findById(recieverUserId);
      if (!recieverUser) {
        return res.status(400).send("User not found");
      }

      // if (senderUserId === recieverUserId) {
      //   return res.status(400).send("Sender and receiver should be different");
      // }

      const allowedStatus = ["ignore", "interest"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status " + status });
      }

      const existingRequestConnection = await ConnectionRequest.findOne({
        $or: [
          { senderUserId, recieverUserId },
          {
            senderUserId: recieverUserId,
            recieverUserId: senderUserId,
          },
        ],
      });
      if (existingRequestConnection) {
        return res.status(400).send("Connection request Already sent");
      }

      const connectionRequest = new ConnectionRequest({
        senderUserId,
        recieverUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " " + recieverUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
