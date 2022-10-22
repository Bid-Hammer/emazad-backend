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
    const item = await itemModel.findOne({ where: { id: obj.itemId }, include: [{ model: bidModel }] });

    // check if the item is standby
    if (item.status === "standby") {
      return res.status(400).json({ message: "The auction for this item has not started yet" });
    }
    // check if the item is already sold
    if (item.status === "sold" || item.status === "expired") {
      return res.status(400).json({ message: "This item is already sold" });
    }
    // check if the user is the owner of the item
    if (Number(obj.userId) === item.userId) {
      return res.status(400).json({ message: "You can not bid on your own item" });
    }
    // check if the bid price is less than the latest bid price
    if (Number(obj.bidprice) < item.latestBid) {
      return res.status(400).json({ message: "Your bid price is lower than the latest bid" });
    }
    // check if the bid price is less than the initial price
    if (Number(obj.bidprice) < item.initialPrice) {
      return res.status(400).json({ message: "first bid should be higher than the initial price" });
    }

    const bid = await Bid.create(obj);
    await itemModel.update({ latestBid: obj.bidprice }, { where: { id: obj.itemId } });

    const filteredUsers = filterUsers(item, obj);
    createNotifications(filteredUsers, item, obj, bid.id);

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// function to filter users who have bid on the item
const filterUsers = (item, obj) => {
  let users = item.Bids.map((bid) => bid.userId);
  let uniqueUsers = [...new Set(users)];
  let filteredUsers = uniqueUsers.filter((user) => user !== Number(obj.userId) && user !== item.userId);
  return filteredUsers;
};

// function to create notifications for all users who have bid on the item
const createNotifications = async (users, item, obj, id) => {
  users.forEach(async (user) => {
    await Notification.create({
      userId: user,
      bidId: id,
      itemId: obj.itemId,
      notiMessage: `You have been outbid on ${item.itemTitle} by ${obj.bidprice}`,
    });
  });

  await Notification.create({
    userId: item.userId,
    bidId: id,
    itemId: obj.itemId,
    notiMessage: `Someone has bid on your item ${item.itemTitle} for ${obj.bidprice}`,
  });
};

module.exports = router;
