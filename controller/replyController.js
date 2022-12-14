"use strict";

const { userModel, replyModel } = require("../models");

const getReplies = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    if (req.params.id) {
      const reply = await replyModel.findOne({
        where: { id: req.params.id },
        include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
      });
      res.status(200).json(reply);
    } else {
      const replies = await replyModel.findAll({
        include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
      });
      res.status(200).json(replies);
    }
  } catch (err) {
    console.log("Error in replyController.getReplies: ", err.message);
  }
};

const createReply = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const reply = await replyModel.create(req.body);
    const output = await replyModel.findOne({
      where: { id: reply.id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });

    res.status(201).json(output);
  } catch (err) {
    console.log("Error in replyController.createReply: ", err.message);
  }
};

const updateReply = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const id = req.params.id;
    await replyModel.update(req.body, {
      where: { id: id },
    });
    const output = await replyModel.findOne({
      where: { id: id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });
    res.status(202).json(output);
  } catch (err) {
    console.log("Error in replyController.updateReply: ", err.message);
  }
};

const deleteReply = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const id = req.params.id;
    const reply = await replyModel.destroy({
      where: { id: id },
    });

    const output = await replyModel.findOne({
      where: { id: id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });
    res.status(204).json(output);
  } catch (err) {
    console.log("Error in replyController.deleteReply: ", err.message);
  }
};

module.exports = {
  getReplies,
  createReply,
  updateReply,
  deleteReply,
};
