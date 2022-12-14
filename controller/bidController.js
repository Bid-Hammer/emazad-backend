"use strict";

const { Notification, itemModel, bidModel, userModel } = require("../models");

const createBid = async (req, res) => {
  try {
    const obj = req.body;
    const item = await itemModel.findOne({ where: { id: obj.itemId }, include: [{ model: bidModel }] });

    // check if the item is standby
    if (item.status === "standby") {
      return res.status(400).json({ message: "The auction for this item has not started yet" });
    }
    // check if the item is already sold
    if (item.status === "sold" || item.status === "expired") {
      return res.status(400).json({ message: "This item was already sold" });
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

    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const bid = await bidModel.create(obj);
    const output = await bidModel.findOne({
      where: { id: bid.id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });

    await itemModel.update({ latestBid: obj.bidprice }, { where: { id: obj.itemId } });

    const filteredUsers = filterUsers(item, obj);
    createNotifications(filteredUsers, item, obj, bid.id);

    res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = createBid;
