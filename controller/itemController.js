`use strict`;

const { itemModel, userModel, bidModel, commentModel, replyModel } = require("../models/index");
const fs = require("fs");
const console = require("console");

const getItems = async (req, res) => {
  try {
    let status = req.params.status;
    let category = req.params.category;
    let subCategory = req.params.subCategory;

    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
    const includeUsers = { include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] };
    const includeAll = [
      { model: userModel, attributes: { exclude: excludedAttributes } },
      { model: bidModel, includeUsers },
    ];

    const sortedItems = (items) => {
      if (status === "standby") {
        return items.sort((a, b) => b.startDate - a.startDate);
      }
      return items.sort((a, b) => b.endDate - a.endDate);
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
      include: includeAll,
    });
    res.status(200).json(sortedItems(items));
  } catch (err) {
    console.log("Error in GeneralRoutes.readItems: ", err.message);
  }
};

const getOneItem = async (req, res) => {
  try {
    const id = req.params.id;
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
    const includeAll = [
      { model: userModel, attributes: { exclude: excludedAttributes } },
      { model: bidModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
      {
        model: commentModel,
        include: [
          { model: userModel, attributes: { exclude: excludedAttributes } },
          { model: replyModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] },
        ],
      },
    ];

    const item = await itemModel.findOne({
      where: { id: id },
      include: includeAll,
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
        obj.itemImage = ["http://www.sitech.co.id/assets/img/products/default.jpg"]
      }

      const item = await itemModel.create(obj, fs);
      res.status(201).json(item);

    } else {
      const item = await itemModel.create(req.body);
      res.status(201).json(item);
    }

  } catch (err) {
    req.files.map((file) => fs.unlinkSync(file.path));
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
      obj = req.body
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
        oldImages = oldImages.filter((oldImage) => oldImage !== "http://www.sitech.co.id/assets/img/products/default.jpg");
      }
    }
    obj.itemImage = oldImages;
    const updatedItem = await itemModel.update(obj, { where: { id: id } });
    res.status(202).json(updatedItem);
  } catch (err) {
    req.files.map((file) => fs.unlinkSync(file.path));
    console.log("Error in GeneralRoutes.updateItem: ", err.message);
  }
};
module.exports = { getItems, getOneItem, addItem, updateItem };
