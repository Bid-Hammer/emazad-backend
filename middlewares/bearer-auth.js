"use strict";
const User = require("../models").userModel;

// bearer auth for checking the token of the user
const bearerAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      // res.status(500).send("Invalid Login");
      next("Invalid Login");
    }
    const token = req.headers.authorization.split(" ").pop();
    const validUser = await User.authenticateToken(token);
    const userInfo = await User.findOne({ where: { email: validUser.email } });
    if (userInfo) {
      if (userInfo.confirmed) {
        req.user = userInfo;
        req.token = userInfo.token;
        next();
      } else {
        next('Please confirm your email to login');
      }
    } else {
      next("Invalid Login");
    }
  } catch (error) {
    next(error.message || error);
  }
};

module.exports = bearerAuth;
