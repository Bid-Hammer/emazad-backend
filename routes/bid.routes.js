"use strict";
const express = require("express");
const router = express.Router();
const { Bid } = require("../models");
const createBid = require("../controller/bidController");
const bearerAuth = require("../middlewares/bearer-auth");

// Routes
router.get("/bid", getBid);
router.get("/bid/:id", getOneBid);
router.post("/bid", bearerAuth, createBid);

// function to get all bids
async function getBid(req, res) {
  let bid = await Bid.read();
  res.status(200).json(bid);
}

// function to get one bid
async function getOneBid(req, res) {
  const id = req.params.id;
  let getOneBid = await Bid.read(id);
  res.status(200).json({ getOneBid });
}

module.exports = router;
