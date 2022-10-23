`use strict`;

const { itemModel, userModel, bidModel, commentModel, replyModel } = require("../models/index");
const fs = require("fs");

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
    const obj = { ...req.body, itemImage: req.files.map((file) => file.path) };
    const item = await itemModel.create(obj, fs);
    res.status(201).json(item);
  } catch (err) {
    req.files.map((file) => fs.unlinkSync(file.path));
    console.log("Error in GeneralRoutes.addItem: ", err.message);
  }
};

module.exports = { getItems, getOneItem, addItem };
