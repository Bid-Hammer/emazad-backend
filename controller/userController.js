`use strict`;
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { itemModel, userModel, bidModel } = require("../models/index");
const { Op } = require("sequelize");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// function for signing up
const signup = async (req, res) => {
  console.log(req.body)
  try {
    const data = {
      ...req.body,

      // if the image is null then it will take the default image if the gender is male or female
      image: req.body.image ? req.body.image : req.body.gender === "male" ? "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png" : "https://whitneyumc.org/wp-content/uploads/2021/12/istockphoto-1136531172-612x612-1-400x400.jpg",

      password: await bcrypt.hash(req.body.password, 10),
    };

    const user = await userModel.create(data);
    if (user) {
      const accessToken = await OAuth2_client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAZAD_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      let mailOptions = {
        from: '"Emazad Contact" <${process.env.EMAZAD_EMAIL}>',
        to: `${data.email}`,
        subject: "Verification Email",
        text: "Welcome to Emazad",
        html: `<h5>Hello ${data.userName} Plase Verify Your Email<h5/><br/>
            <a href="http://localhost:3000/verification/${user.id}">Click Here</a>`, // like for login page in the front end
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
        transporter.close();
      });

      return res.status(201).json(user);
    } else {  
      return res.status(400).send("Invalid Data");
      }
  } catch (error) {
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


const excludedAttributes = ["password", "capabilities", "role", "updatedAt", "token", "confirmed"];
// function for getting user profile
const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findOne({ where: { id: id }, attributes: { exclude: excludedAttributes }});
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

    const updated = await userModel.update(obj, { where: { id: id }});
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
