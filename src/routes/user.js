const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const { User } = require("../models/user");

userRouter.get("/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const requests = await connectionRequest
      .find({
        recieverUserId: loggedUser._id,
        status: "interest",
      })
      .populate("senderUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ]);

    res.json({ message: "Pending requests are below", data: requests });
  } catch (error) {
    res.status(500).send("Error fetching requests: " + error.message);
  }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedUser._id, status: "accept" },
          { recieverUserId: loggedUser._id, status: "accept" },
        ],
      })
      .populate("senderUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ])
      .populate("recieverUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ]);

    const data = connections.map((connection) => {
      if (
        connection.senderUserId?._id.toString() === loggedUser._id.toString()
      ) {
        return connection.recieverUserId;
      }
      return connection.senderUserId;
    });

    res.json({ message: "Connections are below", data });
  } catch (error) {
    res.status(500).send("Error fetching connections: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const startIndex = (page - 1) * limit;
    const feed = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedUser._id },
          { recieverUserId: loggedUser._id },
        ],
      })
      .select("senderUserId recieverUserId");

    const hideUsersFromFeed = new Set();
    feed.forEach((req) => {
      hideUsersFromFeed.add(req.senderUserId._id.toString());
      hideUsersFromFeed.add(req.recieverUserId._id.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })

      .skip(startIndex)
      .limit(limit);
    res.json({ message: "Feed is below", data: users });
    // res.send(feed);
  } catch (error) {
    res.status(500).send("Error fetching feed: " + error.message);
  }
});

module.exports = userRouter;
