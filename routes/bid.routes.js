"use strict";

const express = require("express");
const router = express.Router();

const { Bid } = require("../models");

const notificationRouter = require("./notification.routes");

router.get("/bid", getBid);
router.get("/bid/:id", getOneBid);
router.post("/bid", createBid);
// router.delete("/bid/:id", deleteBid);

async function getBid(req, res) {
  let bid = await Bid.read();
  res.status(200).json(bid);
}

async function getOneBid(req, res) {
  const id = req.params.id;
  let getOneBid = await Bid.read(id);
  res.status(200).json({ getOneBid });
}

// create a function to create a notification when a bid is created

async function createNotification(req, res) {
  let newNotification = req.body;
  // let notification = await Notification.create(newNotification);
  res.status(201).json(newNotification);
}

async function createBid(req, res) {
  let newBid = req.body;
  createNotification(req, res);
  let bid = await Bid.create(newBid);
  res.status(201).json(bid);
}

// async function deleteBid(req, res) {
//   const id = req.params.id;

//   let deletedBid = await Bid.delete(id);
//   res.status(204).send("deleted ");
// }



module.exports = router;
