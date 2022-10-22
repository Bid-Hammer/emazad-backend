`use strict`;
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { itemModel, commentModel, userModel, bidModel } = require("../models/index");

const { Op } = require("sequelize");
const fs = require("fs");

// function for signing up
const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.path : readFileSync("ImgeUsers/dont-delete-2.jpg"),

      // to set a default image when the user does not upload an image, use the line of code below:
      // image: req.file ? req.file.path : req.file ='https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png', 

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

// function for logging in
const login = async (req, res) => {
  const basicHeader = req.headers.authorization.split(" ");
  const encodedString = basicHeader.pop();
  const decodedString = base64.decode(encodedString);
  const [loginData, password] = decodedString.split(":");

  // check the user name or email or phone number is exists
  const user = await userModel.findOne({
    where: {
      [Op.or]: [{ email: loginData }, { userName: loginData }, { phoneNumber: loginData }],
    },
  });

  // check the password is correct and if the user is blocked
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

// function for getting all users
const allUsers = async (req, res) => {
  const userModel = await userModel.findAll();
  res.status(200).json(userModel);
};

// function for getting user profile (items, comments, bids)
const getUserProfile = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({
    where: { id: id },
    include: [itemModel, commentModel, bidModel],
  });
  res.status(200).json({ user });
};

// function for updating user profile
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

// function for getting user SOLD items
const soldItems = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ where: { id: id }, include: [itemModel] });
  const items = user.Items;
  const soldItems = items.filter((item) => item.status === "sold" || item.status === "expired");
  res.status(200).json(soldItems);
};

// function for getting user WON items
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

// function for getting all the items that the user is currently bidding on -> active items
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
