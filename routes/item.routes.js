"use strict";
const express = require("express");
const router = express.Router();
const { Item, Notification, userModel, bidModel, commentModel, replyModel } = require("../models/index");
const uploadItemImg = require("../middlewares/upload-itemImg");
const fs = require("fs");
const { Op, col } = require("sequelize");

// Routes
router.post("/item", uploadItemImg, addItem);
router.put("/item/:id", uploadItemImg, updateItem);
router.delete("/item/:id", deleteItem);
router.put("/itemhide/:id", hideItem);

// get items by category and status
router.get("/items", getItems);
router.get("/items/:status", getItems);
router.get("/items/:status/:category", getItems);
router.get("/items/:status/:category/:subCategory", getItems);
router.get("/item/:id", getOneItem);

// function to get all items -> by category || subCategory || all
async function getItems(req, res) {
  try {
    let status = req.params.status;
    let category = req.params.category;
    let subCategory = req.params.subCategory;

    // if there is category and subCategory based on the status
    if (status && category && subCategory) {
      const item = await Item.readItems(status, category, subCategory, userModel, bidModel);
      res.status(200).json(item);

      // if there is only category and status
    } else if (status && category) {
      const item = await Item.readItems(status, category, null, userModel, bidModel);
      res.status(200).json(item);

      // if there is only status
    } else if (status) {
      const item = await Item.readItems(status, null, null, userModel, bidModel);
      res.status(200).json(item);

      // if there is no status
    } else {
      const item = await Item.readItems(null, null, null, userModel, bidModel);
      res.status(200).json(item);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// function to get one item by id
async function getOneItem(req, res) {
  let id = req.params.id;
  let item = await Item.readOneItem(id, userModel, bidModel, commentModel, replyModel);
  res.status(200).json(item);
}

// function to add an item
async function addItem(req, res) {
  try {
    const dataBody = {
      ...req.body,
      itemImage: req.files.map((file) => file.path),
    };
    const item = await Item.createItem(dataBody, fs);
    res.status(201).json(item);
  } catch (err) {
    req.files.map((file) => fs.unlinkSync(file.path));
    res.status(500).json({ message: err.message });
  }
}

// function to update an item by id
async function updateItem(req, res) {
  const id = req.params.id;
  const obj = req.body;
  const updatedItem = await Item.update(id, obj);
  res.status(200).json(updatedItem);
}

// function to delete an item by id
async function deleteItem(req, res) {
  const id = req.params.id;
  const itemDeleted = await Item.read(id);
  itemDeleted.itemImage.map((path) => {
    fs.unlinkSync(path);
  });
  let deletedItem = await Item.delete(id);
  res.status(204).json({ deletedItem });
}

// function to hide an item
async function hideItem(req, res) {
  const id = req.params.id;
  const item = await Item.hide(id);
  res.status(200).json(item);
}

// Update item status automatically based on the date
setInterval(async () => {
  try {
    const currentDate = new Date();
    const items = await Item.read();
    // console.log(currentDate);

    items.map(async (item) => {
      // change status from standby to active when the start date is reached
      if (item.status === "standby" && item.startDate < currentDate) {
        await Item.update(item.id, { status: "active" });

        await Notification.create({
          userId: item.userId,
          itemId: item.id,
          notiMessage: `Your item ${item.itemTitle} is now active`,
        });
      }

      // change status from active to sold after the end date is reached
      if (item.status === "active" && item.endDate < currentDate) {
        await Item.update(item.id, { status: "sold" });

        if (item.latestBid > 0) {
          const itemBids = await bidModel.findOne({
            where: { itemId: item.id, bidprice: item.latestBid },
          });
          await Notification.create({
            userId: itemBids.userId,
            itemId: item.id,
            notiMessage: `You won the bid for ${item.itemTitle}`,
          });
        }
        await Notification.create({
          userId: item.userId,
          itemId: item.id,
          notiMessage: `The auction for your item ${item.itemTitle} is over`,
        });
      }

      // change status from sold to expired after 30 days from the end date
      if (item.status === "sold" && item.endDate < currentDate - 30 * 24 * 60 * 60 * 1000) {
        await Item.update(item.id, { status: "expired" });
      }
    });
  } catch (err) {
    console.log(err);
  }

  // setting the interval to 1 minute
}, 10000);

module.exports = router;
