`use strict`;
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { itemModel, commentModel, userModel, bidModel, favoriteModel, ratingModel } = require("../models/index");

const { Op } = require("sequelize");
const fs = require("fs");

const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.path : readFileSync("ImgeUsers/dont-delete-2.jpg"),
      password: await bcrypt.hash(req.body.password, 10),
    };
    const user = await userModel.create(data);
    if (user) {
      res.status(201).json(user);
    } else {
      // console.log(req.file.path);
      req.file ? fs.unlinkSync(req.file.path) : null;
    }
  } catch (error) {
    req.file ? fs.unlinkSync(req.file.path) : null;
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  const basicHeader = req.headers.authorization.split(" ");
  const encodedString = basicHeader.pop();
  const decodedString = base64.decode(encodedString);
  const [email, password] = decodedString.split(":");
  // check the user name or email or phone number is exists

  const user = await userModel.findOne({
    where: {
      [Op.or]: [{ email: email }, { userName: email }, { phoneNumber: email }],
    },
  });
  // const user = await userModel.findOne();

  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid && user.status !== "blocked") {
      res.status(200).json(user);
      console.log(`you are ${user.status}`);
    } else {
      res.status(403).send("Invalid Login");
    }
  } else {
    res.status(403).send("Invalid Login");
  }
};

const allUsers = async (req, res) => {
  const userModel = await userModel.findAll();
  res.status(200).json(userModel);
};

const getUserProfile = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({
    where: { id: id },
    include: [itemModel, commentModel, bidModel, favoriteModel, ratingModel],
  });
  res.status(200).json({ user });
};

const updateUserProfile = async (req, res) => {
  const id = req.params.id;
  const obj = req.body;
  const updatedUser = await userModel.findOne({ where: { id: id } });
  if (updatedUser.image !== obj.image) {
    fs.unlinkSync(updatedUser.image);
  }
  const updated = await updatedUser.update(obj);
  res.status(202).json(updated);
};

const soldItems = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ where: { id: id }, include: [itemModel] });
  const items = user.Items;
  const soldItems = items.filter((item) => item.status === "sold" || item.status === "expired");
  res.status(200).json(soldItems);
};

const wonItems = async (req, res) => {
  const id = req.params.id;
  const user = await itemModel.findAll({ include: { model: bidModel, include: userModel } });

  const wonItems = user.filter(
    (item) =>
      item.Bids.length > 0 &&
      item.Bids[item.Bids.length - 1].dataValues.userID === Number(id) &&
      (item.status === "sold" || item.status === "expired")
  );

  res.status(200).json(wonItems);
};

const userEngagedItems = async (req, res) => {
  const id = req.params.id;
  const user = await itemModel.findAll({ include: { model: bidModel, include: userModel } });

  const engagedItems = user.filter((item) => {
    if (item.Bids.length > 0 && item.status === "active") {
      const bids = item.Bids.map((bid) => bid.dataValues.userID);
      if (bids.includes(Number(id))) {
        return item;
      }
    }
  });

  res.status(200).json(engagedItems);
};

module.exports = {
  signup,
  login,
  allUsers,
  getUserProfile,
  updateUserProfile,
  soldItems,
  wonItems,
  userEngagedItems,
};
