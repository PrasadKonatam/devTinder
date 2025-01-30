const express = require("express");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    recieverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignore", "interest", "accept", "reject"],
        message: `{VALUE} is incorrect type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.senderUserId.equals(connectionRequest.recieverUserId)) {
    throw new Error("You connot sent request to youself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
