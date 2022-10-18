"use strict";
const express = require("express");
const router = express.Router();
const { Item } = require("../models");
// const { notificationModel } = require("../models");
const uploadItemImg = require("../middlewares/upload-itemImg");
const fs = require("fs");

// Routes:

router.get("/items", getAllItems); // to the items in the database
router.get("/items/:id", getItem); // to get one item with the id
router.post("/item", uploadItemImg, addItem); // to add a new item to the list
router.put("/item/:id", updateItem); // to update an item
router.delete("/item/:id", deleteItem); // to delete an item from the list
// router.get("/itemsnotif", getAllItemsWithNotifications); // to the items in the database

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
  const dataBody = { ...req.body, itemImage: req.files.map(file => file.path) }
  const item = await Item.create(dataBody);
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
  // console.log(id);
  const itemDeleted = await Item.read(id);
  console.log(itemDeleted.itemImage);
  // delete image useing fs 
  // itemDeleted.itemImage.forEach(image => {
  //   fs.unlink(image, (err) => {
  //     if (err) {
  //       console.error(err)
  //       return
  //     }
  //   })
  // });


  // console.log(itemDeleted.itemImage);
  // delete images form the server
  // Object.entries(itemDeleted.itemImage).forEach((image) => {
  //   console.log(image);
  // fn.unlink(image, (err) => {
  //   if (err) {
  //     console.error(err)
  //     return
  //   }
  // })

  // itemDeleted.itemImage.map(Image => {
  //   console.log(Image);
  //   fs.unlink(Image, (err) => {
  //     if (err) {
  //       console.error(err)
  //       return
  //     }
  //   })
  // })

  let path = [];
  let pathChar = [];
  // for (const Image of itemDeleted.itemImage) {
  //   // console.log(Image);
  //   if (Image === '{' || Image === '}' || Image === '"') {
  //     continue;
  //   } else if (Image === ',') {
  //     console.log(path);
  //     // fs.unlink(path.join(''));
  //     // fs.unlinkSync(path.join(''));
  //     path.push(pathChar.join(''));
  //     // pathChar = [];
  //     continue;
  //   } else {
  //     pathChar.push(Image);
  //   }
  // }

  // console.log(path);


  Object.values(itemDeleted.itemImage).forEach((image) => {
    if (image === '{' || image === '}' || image === '"') {

    } else if (image === ',') {
      console.log(path);
      // fs.unlink(path.join(''));
      fs.unlinkSync(path.join(''));
      // path.push(pathChar.join(''));
      path = [];

    } else {
      path.push(image);
    }
  })







  // let deletedItem = await Item.delete(id);
  // res.status(204).json({ deletedItem });
}

// async function getAllItemsWithNotifications(req, res) {
//   let item = await Item.itemWithNotification(notificationModel);
//   res.status(200).json({
//     item,
//   });
// }

module.exports = router;
