"use strict";
const express = require("express");
const router = express.Router();
const {
  Item,
  commentModel,
  userModel,
  bidModel,
  favoriteModel,
  ratingModel,
} = require("../models/index");
const { Op } = require("sequelize");
const uploadItemImg = require("../middlewares/upload-itemImg");
const fs = require("fs");

// Routes:

router.get("/item", getAllItems);
router.get("/item/:id", getItem);
router.post("/item", uploadItemImg, addItem);
router.put("/item/:id", uploadItemImg, updateItem);
router.delete("/item/:id", deleteItem);

router.get("/allitem", getItemWithAllData);
router.put("/itemhide/:id", hideItem);

// Functions:

async function hideItem(req, res) {
  const id = req.params.id;
  const item = await Item.hide(id);
  res.status(200).json(item);
}

async function getItemWithAllData(req, res) {
  try {
    const item = await Item.itemWithAllInfo(
      commentModel,
      bidModel,
      userModel,
      favoriteModel,
      ratingModel,
      Op
    );
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllItems(req, res) {
  let item = await Item.read();
  res.status(200).json({
    item,
  });
}

async function getItem(req, res) {
  let id = req.params.id;
  let item = await Item.read(id);
  res.status(200).json(item);
}

async function addItem(req, res) {
  try {
    const dataBody = {
      ...req.body,
      itemImage: req.files.map((file) => file.path),
    };
    const item = await Item.createItem(dataBody, fs);
    res.status(201).json(item);
  } catch (err) {
    console.log(req.files)
    req.files.map((file) => fs.unlinkSync(file.path));
    res.status(500).json({ message: err.message })
  }

}

async function updateItem(req, res) {
  const id = req.params.id;
  const obj = req.body;

  const updatedItem = await Item.update(id, obj);
  res.status(200).json(updatedItem);
}

async function deleteItem(req, res) {
  const id = req.params.id;
  const itemDeleted = await Item.read(id);

  itemDeleted.itemImage.map((path) => {
    fs.unlinkSync(path);
  });

  let deletedItem = await Item.delete(id);
  res.status(204).json({ deletedItem });
}


// update the item status to active when the startDate is less than the current date
setInterval(async () => {
  const currentDate = new Date();
  const items = await Item.read();

  items.map(async (item) => {
    if (item.startDate < currentDate) {
      await Item.update(item.id, { status: "active" });
    }
    if (item.endDate < currentDate) {
      await Item.update(item.id, { status: "sold" });
    }
    if (item.endDate < currentDate - 2) {
      await Item.update(item.id, { status: "expired" });
    }
  });

}, 100000);


module.exports = router;
