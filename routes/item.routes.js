"use strict";

const express = require("express");
const router = express.Router();
const { Item } = require("../models");

// Routes:

router.get("/items", getAllItems); // to the items in the database
router.get("/items/:id", getItem); // to get one item with the id
router.post("/item", addItem); // to add a new item to the list
router.put("/item/:id", updateItem); // to update an item
router.delete("./item/:id", deleteItem); // to delete an item from the list

// Functions:

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
  const newItem = req.body;
  const item = await Item.create(newItem);
  res.status(201).json(item);
}

async function updateItem(req, res) {
  const id = req.params.id;
  const obj = req.body;

  const updatedItem = await Item.update(id, obj);
  res.status(200).json(updatedItem);
}

async function deleteItem(req, res) {
  const id = req.params.id;
  let deletedItem = await Item.delete(id);
  res.status(204).json({ deletedItem });
}

module.exports = router;
