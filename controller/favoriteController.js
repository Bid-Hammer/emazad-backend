"use strict";

const { favoriteModel, itemModel } = require("../models");

const userFavorites = async (req, res) => {
  try {
    const favorites = await favoriteModel.findAll({
      where: { userId: req.params.id },
      include: [{ model: itemModel }],
    });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const createFavorite = async (req, res) => {
  try {
    const favorites = await favoriteModel.findAll({
      where: { userId: req.body.userId },
      include: [{ model: itemModel }],
    });
    const isExist = favorites.some((favorite) => favorite.itemId === req.body.itemId);
    if (isExist) {
      res.status(400).json("Item already exist in favorite list");
    } else {
      const favorite = await favoriteModel.create(req.body);
      res.status(201).json(favorite);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  userFavorites,
  createFavorite,
};
