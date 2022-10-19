`use strict`;

const base64 = require("base-64");
const bcrypt = require("bcrypt");
// const userModel = require("../models/index").userModel;

const {
    itemModel,
    commentModel,
    userModel,
    bidModel,
    favoriteModel,
    ratingModel,
  } = require("../models/index");

const signup = async (req, res) => {
    try {
        const data = { ...req.body, image: req.file.path, password: await bcrypt.hash(req.body.password, 10) };
        const user = await userModel.create(data);
        if (user) {
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    const basicHeader = req.headers.authorization.split(" ");
    const encodedString = basicHeader.pop();
    const decodedString = base64.decode(encodedString);
    const [email, password] = decodedString.split(":");
    const user = await userModel.findOne({ where: { email: email } });

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
    const user = await userModel.findOne({ where: { id: id }, include: [itemModel, commentModel, bidModel, favoriteModel, ratingModel] });
    res.status(200).json( {user} );
};

const updateUserProfile = async (req, res) => {
    const id = req.params.id;
    const obj = req.body;
    const updatedUser = await userModel.findOne({ where: { id: id } });
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

// create a function where the user is the last person to make a bid on an item
const wonItems = async (req, res) => {
    const id = req.params.id;
    const user = await itemModel.findAll({ where: { userID: id }, include: { model: bidModel, include: userModel } });
        
    res.status(200).json(user);
    };


module.exports = {
    signup,
    login,
    allUsers,
    getUserProfile,
    updateUserProfile,
    soldItems,
    wonItems,
};
