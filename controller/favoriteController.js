"use strict";

const { favoriteModel, itemModel, userModel } = require("../models");

const userFavorites = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const favorites = await favoriteModel.findAll({
      where: { userId: req.params.id },
      include: [{ model: itemModel, include: [{ model: userModel, attributes: { exclude: excludedAttributes } }] }],
    });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const createFavorite = async (req, res) => {
  try {
    const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];

    const favorites = await favoriteModel.findAll({
      where: { userId: req.body.userId },
    });
    const isExist = favorites.some((favorite) => favorite.itemId === req.body.itemId);
    if (isExist) {
      res.status(400).json("The item already exists in favorite list");
    } else {
      const favorite = await favoriteModel.create(req.body);
      const output = await favoriteModel.findOne({
        where: { id: favorite.id },
        include: [{ model: userModel, attributes: { exclude: excludedAttributes } }],
      });
      res.status(201).json(output);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  userFavorites,
  createFavorite,
};
