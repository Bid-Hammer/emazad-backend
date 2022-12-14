`use strict`;

const { itemModel, userModel, bidModel, commentModel, replyModel, favoriteModel } = require("../models/index");
const fs = require("fs");
const console = require("console");

const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

const itemIncludes = [
  { model: userModel, attributes: { exclude: excludedAttributes } },
  { model: bidModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
  {
    model: commentModel,
    include: [
      { model: userModel, attributes: { exclude: excludedAttributes } },
      { model: replyModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
    ],
  },
  { model: favoriteModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
];

const itemsIncludes = [
  { model: userModel, attributes: { exclude: excludedAttributes } },
  { model: bidModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
  { model: favoriteModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
];

const getItems = async (req, res) => {
  try {
    let status = req.params.status;
    let category = req.params.category;
    let subCategory = req.params.subCategory;

    const sortedItems = (items) => {
      if (status === "standby") {
        return items.sort((a, b) => b.startDate - a.startDate);
      } else if (status === "active") {
        return items.sort((a, b) => b.endDate - a.endDate);
      } else if (status === "sold" || status === "expired") {
        return items.sort((a, b) => b.updatedAt - a.updatedAt);
      } else {
        return items.sort((a, b) => b.endDate - a.endDate);
      }
    };

    let handelWhere = {};
    if (status && !category && !subCategory) {
      status === "all" ? null : (handelWhere = { status: status });
    }
    if (status && category && !subCategory) {
      status === "all"
        ? (handelWhere = { category: category })
        : (handelWhere = { status: status, category: category });
    }
    if (status && category && subCategory) {
      status === "all"
        ? (handelWhere = { category: category, subCategory: subCategory })
        : (handelWhere = { status: status, category: category, subCategory: subCategory });
    }

    const items = await itemModel.findAll({
      where: handelWhere,
      include: itemsIncludes,
    });
    res.status(200).json(sortedItems(items));
  } catch (err) {
    console.log("Error in GeneralRoutes.readItems: ", err.message);
  }
};

const getOneItem = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await itemModel.findOne({
      where: { id: id },
      include: itemIncludes,
      order: [
        [bidModel, "createdAt", "DESC"],
        [commentModel, "createdAt", "DESC"],
        [commentModel, replyModel, "createdAt", "DESC"],
      ],
    });
    res.status(200).json(item);
  } catch (err) {
    console.log("Error in GeneralRoutes.readOneItem: ", err.message);
  }
};

const addItem = async (req, res) => {
  try {
    if (!req.body.itemImage) {
      const obj = { ...req.body, itemImage: req.files.map((file) => file.path) };

      if (req.files.length === 0) {
        obj.itemImage = ["http://www.sitech.co.id/assets/img/products/default.jpg"];
      }

      const item = await itemModel.create(obj, fs);
      const output = await itemModel.findOne({
        where: { id: item.id },
        include: itemIncludes,
      });
      res.status(201).json(output);
    } else {
      const item = await itemModel.create(req.body);
      const output = await itemModel.findOne({
        where: { id: item.id },
        include: itemIncludes,
      });
      res.status(201).json(output);
    }
  } catch (err) {
    req.file && req.files.map((file) => fs.unlinkSync(file.path));
    console.log("Error in GeneralRoutes.addItem: ", err.message);
  }
};

// update item by id and update itemImage if there is a new image and delete the old image if you need
const updateItem = async (req, res) => {
  const deletedImages = req.query.deletedImages;
  console.log(deletedImages);
  try {
    const id = req.params.id;
    let item = null;
    let oldImages = null;
    let newImages = null;
    let obj = null;
    if (!req.body.itemImage) {
      obj = { ...req.body, itemImage: req.files.map((file) => file.path) };
      item = await itemModel.findOne({ where: { id: id } });
      oldImages = item.itemImage;
      newImages = obj.itemImage;
    } else {
      obj = req.body;
      item = await itemModel.findOne({ where: { id: id } });
      oldImages = item.itemImage;
      newImages = obj.itemImage;
    }
    if (deletedImages) {
      deletedImages.split(",").map((image) => {
        if (oldImages.includes(image)) {
          oldImages = oldImages.filter((oldImage) => oldImage !== image);
          fs.unlinkSync(image);
        }
      });
    }

    if (newImages.length > 0) {
      oldImages = [...oldImages, ...newImages];
      if (oldImages.includes("http://www.sitech.co.id/assets/img/products/default.jpg")) {
        oldImages = oldImages.filter(
          (oldImage) => oldImage !== "http://www.sitech.co.id/assets/img/products/default.jpg"
        );
      }
    }
    obj.itemImage = oldImages;
    const updatedItem = await itemModel.update(obj, { where: { id: id } });

    const output = await itemModel.findOne({
      where: { id: updatedItem.id },
      include: itemIncludes,
    });

    res.status(202).json(output);
  } catch (err) {
    req.files.map((file) => fs.unlinkSync(file.path));
    console.log("Error in GeneralRoutes.updateItem: ", err.message);
  }
};

// get trending items
const getTrendingItems = async (req, res) => {
  try {
    const items = await itemModel.findAll({
      where: { status: "active" },
      include: itemsIncludes,
    });
    const sortedItems = items.sort((a, b) => b.Bids.length - a.Bids.length && a.endDate - b.endDate);
    res.status(200).json(sortedItems);
  } catch (err) {
    console.log("Error in GeneralRoutes.getTrendingItems: ", err.message);
  }
};

module.exports = { getItems, getOneItem, addItem, updateItem, getTrendingItems };
