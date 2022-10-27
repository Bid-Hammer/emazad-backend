`use strict`;
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { itemModel, userModel, bidModel } = require("../models/index");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const fs = require("fs");
// const { readFileSync } = require("fs");

// function for signing up
const signup = async (req, res) => {
  try {
    const data = {
      ...req.body,

      // to set a default image when the user does not upload an image, use the line of code below:
      image: req.file ? req.file.path : req.body.gender === 'male' ?
        'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png' :
        'https://whitneyumc.org/wp-content/uploads/2021/12/istockphoto-1136531172-612x612-1-400x400.jpg',
      password: await bcrypt.hash(req.body.password, 10),
    };

    const user = await userModel.create(data);
    if (user) {

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525, //587
        // secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.USER_HOST,
          pass: process.env.PASS_HOST,
        },
      });

      let mailOptions = {
        from: '"Emazad Contact" <qaisalsgher@gmail.com>',
        to: `${data.email}`,
        subject: 'Verification Email',
        text: 'Welcome to Emazad',
        html: `<h5>Hello ${data.userName} Plase Verifie Your Email<h5/><br/>
            <a href="http://localhost:8080/verfication/${user.id}">Click Here</a>`, // like for login page in the front end
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // return res.status(400).json(error);
          return console.log(error);

        }
        res.render('contact', { msg: 'Verification Email has been sent!' });
      });

      return res.status(201).json(user);

    } else {
      fs.unlinkSync(req.file.path);
    }


  } catch (error) {
    fs.unlinkSync(req.file.path);
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
        if (user.confirmed) {
          return res.status(200).json(user);
        } else {
          return res.status(400).send("Please Verify Your Email!");
        }
      } else {
        return res.status(403).send("Invalid Login");
      }
    } else {
      return res.status(403).send("Invalid Login");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// verification email is real user or not
const verification = async (req, res) => {
  const user = await userModel.findOne({ where: { id: req.params.id } });
  if (user) {
    const basicHeader = req.headers.authorization.split(" ");
    const encodedString = basicHeader.pop();
    const decodedString = base64.decode(encodedString);
    const [email, password] = decodedString.split(":");

    if (user.email === email || user.userName === email || user.phoneNumber === email) {

      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        user.confirmed = true;
        await user.save();
        return res.status(200).json(user);
      } else {
        return res.status(403).send("Invalid Login");
      }
    } else {
      return res.status(403).send("Invalid Login");
    }
  } else {
    return res.status(403).send("Invalid Login");
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
    const updatedUser = await userModel.findOne({ where: { id: id } });
    const obj = { ...req.body, image: req.file ? req.file.path : updatedUser.image };

    if (req.file && (updatedUser.image !== ('https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png' || 'https://whitneyumc.org/wp-content/uploads/2021/12/istockphoto-1136531172-612x612-1-400x400.jpg'))) {
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
      where: { userId: id, status: "standby" },
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
    const user = await itemModel.findAll({ include: { model: bidModel, include: userModel } });
    const wonItems = user.filter(
      (item) =>
        item.Bids.length > 0 &&
        item.Bids[item.Bids.length - 1].dataValues.userId === Number(id) &&
        (item.status === "sold" || item.status === "expired")
    );
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
  verification,
};
