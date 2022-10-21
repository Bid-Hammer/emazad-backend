"use strict";
const express = require("express");
const router = express.Router();
const { Bid, Notification, itemModel, bidModel } = require("../models");

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
  const item = await itemModel.findOne({
    where: { id: obj.itemID },
    include: [{ model: bidModel }],
  });

  try {
    if (Number(obj.userID) !== item.userID) {
      let bid = await Bid.create(obj);
      const id = bid.dataValues.id;

      let users = item.Bids.map((bid) => bid.userID);
      let uniqueUsers = [...new Set(users)];
      let filteredUsers = uniqueUsers.filter((user) => user !== Number(obj.userID) && user !== item.userID);

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
        notiMessage: `Someone has bid on your item ${item.itemTitle} for ${obj.bidprice}`,
      });

      res.status(201).json(bid);
    } else {
      res.status(500).json({ message: "You cannot bid on your own item" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteBid(req, res) {
  const id = req.params.id;

  let deletedBid = await Bid.delete(id);
  res.status(204).send(deletedBid);
}

module.exports = router;
