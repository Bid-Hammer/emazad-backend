`use strict`;
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { itemModel, userModel, bidModel } = require("../models/index");

const { Op } = require("sequelize");
const fs = require("fs");

// function for signing up
const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,
      // to set a default image when the user does not upload an image, use the line of code below:
      image: req.file ? req.file.path : req.file ='https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png', 

      password: await bcrypt.hash(req.body.password, 10),
    };
    const user = await userModel.create(data);
    if (user) {
      res.status(201).json(user);
    } else {
      req.file ? fs.unlinkSync(req.file.path) : null;
    }
  } catch (error) {
    req.file ? fs.unlinkSync(req.file.path) : null;
    res.status(500).send(error.message);
  }
};

// function for logging in
const login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting all users
const allUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting user profile
const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findOne({ where: { id: id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for updating user profile
const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const obj = req.body;
    const updatedUser = await userModel.findOne({ where: { id: id } });
    if (updatedUser.image !== obj.image) {
      fs.unlinkSync(updatedUser.image);
    }
    const updated = await updatedUser.update(obj);
    res.status(202).json(updated);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting user's active items
const userActiveItems = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await itemModel.findAll({
      where: { userId: id, status: "active" },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting user's standBy items
const userStandByItems = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await itemModel.findAll({
      where: { userId: id, status: "standBy" },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting user SOLD items
const userSoldItems = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await itemModel.findAll({
      where: { userId: id, status: ["sold", "expired"] },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting user WON items
const userWonItems = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await itemModel.findAll({
      where: { status: ["sold", "expired"] },
      include: { bidModel },
    });
    const wonItems = items.filter((item) => item.Bids.length > 0 && item.Bids[item.Bids.length - 1].userId === id);
    res.status(200).json(wonItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// function for getting all the items that the user is currently bidding on -> active items
const userEngagedItems = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await itemModel.findAll({
      where: { status: "active" },
      include: { model: bidModel, where: { userId: id } },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  signup,
  login,
  allUsers,
  getUserProfile,
  updateUserProfile,
  userActiveItems,
  userStandByItems,
  userSoldItems,
  userWonItems,
  userEngagedItems,
};
