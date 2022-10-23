"use strict";

const { chatModel, userModel } = require("../models");
const { Op } = require("sequelize");

const getChat = async (req, res, next) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const chat = await chatModel.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: [{ model: userModel }],
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

const sendChat = async (req, res, next) => {
  try {
    const chat = await chatModel.create(req.body);
    res.status(201).json(chat);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getChat,
  sendChat,
};
