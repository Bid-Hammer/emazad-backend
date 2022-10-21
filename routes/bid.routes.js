"use strict";
const express = require("express");
const router = express.Router();
const { Bid, Notification, itemModel, bidModel } = require("../models");

// Routes
router.get("/bid", getBid);
router.get("/bid/:id", getOneBid);
router.post("/bid", createBid);

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

// function to create a bid and send notifications to all users who have bid on the item
async function createBid(req, res) {
  try {
    const obj = req.body;
    const item = await itemModel.findOne({ where: { id: obj.itemID }, include: [{ model: bidModel }] });

    if (Number(obj.userID) !== item.userID) {
      const bid = await Bid.create(obj);
      const id = bid.dataValues.id;
      const filteredUsers = filterUsers(item, obj);

      createNotifications(filteredUsers, item, obj, id);

      res.status(201).json(bid);
    } else {
      res.status(500).json({ message: "You cannot bid on your own item" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const filterUsers = (item, obj) => {
  let users = item.Bids.map((bid) => bid.userID);
  let uniqueUsers = [...new Set(users)];
  let filteredUsers = uniqueUsers.filter((user) => user !== Number(obj.userID) && user !== item.userID);
  return filteredUsers;
};

const createNotifications = async (users, item, obj, id) => {
  users.forEach(async (user) => {
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
    notiMessage: `Someone has bid on your item ${item.itemTitle} for ${obj.bidprice}`,
  });
};

module.exports = router;
