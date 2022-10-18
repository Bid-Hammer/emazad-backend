"use strict";

const express = require("express");
const router = express.Router();

const { Bid } = require("../models");

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

async function createBid(req, res) {
  let newBid = req.body;
  let bid = await Bid.create(newBid);
  res.status(201).json(bid);
}

// async function deleteBid(req, res) {
//   const id = req.params.id;

//   let deletedBid = await Bid.delete(id);
//   res.status(204).send("deleted ");
// }

module.exports = router;
