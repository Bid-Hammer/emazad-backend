"use strict";
const User = require("../models").userModel;
const fs = require("fs");

// Basic Auth middleware for checking if the user data is valid or not
const basicAuth = async (req, res, next) => {
  try {
    const userName = await User.findOne({ where: { userName: req.body.userName } });

    if (userName) {
      req.file ? fs.unlinkSync(req.file.path) : null;
      return res.status(409).send("Username already exists");
    } else {
      const email = await User.findOne({ where: { email: req.body.email } });

      if (email) {
        req.file ? fs.unlinkSync(req.file.path) : null;
        return res.status(409).send("Email already exists");
      }

      const phoneNumber = await User.findOne({ where: { phoneNumber: req.body.phoneNumber } });
      if (phoneNumber) {
        req.file ? fs.unlinkSync(req.file.path) : null;
        return res.status(409).send("Phone number already exists");
      }
    }
    next();
  } catch (error) {
    next(error.message || error);
  }
};

module.exports = basicAuth;
