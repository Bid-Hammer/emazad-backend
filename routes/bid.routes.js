"use strict";

const express = require("express");
const router = express.Router();

const Sequelize = require("sequelize");

const { Bid } = require("../models");
const { Notification } = require("../models");
const { itemModel, userModel } = require("../models");
const { bidModel } = require("../models");

router.get("/bid", getBid);
router.get("/bid/:id", getOneBid);
router.post("/bid", createBid);
router.delete("/bid/:id", deleteBid);

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
  const obj = req.body;
  let bid = await Bid.create(obj);
  const id = bid.dataValues.id;

  let item = await itemModel.findOne({
    where: { id: obj.itemID },
    include: [
      {
        model: bidModel,
      },
    ],
  });

  let users = item.Bids.map((bid) => bid.userID);
  let uniqueUsers = [...new Set(users)];
  let filteredUsers = uniqueUsers.filter(
    (user) =>
      Number(user) !== Number(obj.userID) &&
      Number(user) !== Number(item.userID)
  );

  filteredUsers.forEach(async (user) => {
    await Notification.create({
      userID: user,
      bidID: id,
      itemID: obj.itemID,
      notiMessage: `You have been outbid on ${item.itemTitle} by ${obj.bidprice}`,
    });
  });

  await Notification.create({
    userID: item.userID,
    bidID: id,
    itemID: obj.itemID,
    notiMessage: `Someone has bid on ${item.itemTitle} for ${obj.bidprice}`,
  });

  res.status(201).json(bid);
}

async function deleteBid(req, res) {
  const id = req.params.id;

  let deletedBid = await Bid.delete(id);
  res.status(204).send(deletedBid);
}

module.exports = router;
