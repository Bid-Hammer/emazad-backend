"use strict";

const { userModel, commentModel } = require("../models/index");

const getComments = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    if (req.params.id) {
      const comment = await commentModel.findOne({
        where: { id: req.params.id },
        include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
      });
      res.status(200).json(comment);
    } else {
      const comments = await commentModel.findAll({
        include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
      });
      res.status(200).json(comments);
    }
  } catch (err) {
    console.log("Error in commentController.getComments: ", err.message);
  }
};

const createComment = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const comment = await commentModel.create(req.body);
    const output = await commentModel.findOne({
      where: { id: comment.id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });

    res.status(201).json(output);
  } catch (err) {
    console.log("Error in commentController.createComment: ", err.message);
  }
};

const updateComment = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const id = req.params.id;
    await commentModel.update(req.body, {
      where: { id: id },
    });

    const output = await commentModel.findOne({
      where: { id: id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });
    res.status(202).json(output);
  } catch (err) {
    console.log("Error in commentController.updateComment: ", err.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const id = req.params.id;
    const comment = await commentModel.destroy({
      where: { id: id },
      include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
    });
    res.status(204).json(comment);
  } catch (err) {
    console.log("Error in commentController.deleteComment: ", err.message);
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
