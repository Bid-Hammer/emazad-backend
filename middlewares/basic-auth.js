"use strict";
const User = require("../models").userModel;
const fs = require("fs");

// Basic Auth middleware for checking if the user data is valid or not
const basicAuth = async (req, res, next) => {

  try {

    if (isNaN(req.body.phoneNumber)) {

      res.status(400).json({ message: 'phone number must contain only numbers' });

    } else if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/)) {

      res.status(400).json({ message: 'email is not valid' });

    }

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
