"use strict";
const express = require("express");
const router = express.Router();
const { Item, commentModel, userModel, bidModel, favoriteModel } = require("../models/index");
const { Op } = require("sequelize");
const uploadItemImg = require("../middlewares/upload-itemImg");
const fs = require("fs");

// Routes
router.post("/item", uploadItemImg, addItem);
router.put("/item/:id", uploadItemImg, updateItem);
router.delete("/item/:id", deleteItem);
router.put("/itemhide/:id", hideItem);

router.get("/item", getItems);
router.get("/item/:category", getItems);
router.get("/item/:category/:subCategory", getItems);
router.get("/item/:id", getOneItem);

// function to get all items -> by category || subCategory || all
async function getItems(req, res) {
  try {

    // if there is category and subCategory
    if (req.params.category && req.params.subCategory) {
      const item = await Item.readItems(req.params.category, req.params.subCategory, commentModel, bidModel, userModel, favoriteModel, Op);
      res.status(200).json(item);

    // if there is only category
    } else if (req.params.category) {
      const item = await Item.readItems(req.params.category, null, commentModel, bidModel, userModel, favoriteModel, Op);
      res.status(200).json(item);

    // if there is no category or subCategory  
    } else {
      const item = await Item.readItems(null, null, commentModel, bidModel, userModel, favoriteModel, Op);
      res.status(200).json(item);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// function to hide an item
async function hideItem(req, res) {
  const id = req.params.id;
  const item = await Item.hide(id);
  res.status(200).json(item);
}

// function to get one item by id
async function getOneItem(req, res) {
  let id = req.params.id;
  let item = await Item.read(id);
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
  itemDeleted.itemImage.map((path) => { fs.unlinkSync(path); });
  let deletedItem = await Item.delete(id);
  res.status(204).json({ deletedItem });
}

// Update item status automatically based on the date
setInterval(async () => {
  const currentDate = new Date();
  const items = await Item.read();

  items.map(async (item) => {

    // change status from standby to active when the start date is reached
    if (item.status === "standBy" && item.startDate < currentDate) {
      await Item.update(item.id, { status: "active" });
    }

    // change status from active to sold after the end date is reached
    if (item.status === "active" && item.endDate < currentDate) {
      await Item.update(item.id, { status: "sold" });
    }

    // change status from sold to expired after 30 days from the end date
    if (item.status === "sold" && item.endDate < currentDate - 2592000000) {
      await Item.update(item.id, { status: "expired" });
    }
  });
  // setting the interval to 1 minute
}, 100000);

module.exports = router;
