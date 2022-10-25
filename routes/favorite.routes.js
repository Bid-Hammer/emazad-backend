"use strict";
const express = require("express");
const router = express.Router();
const { Favorite, userModel, itemModel } = require("../models");
const { userFavorites, createFavorite } = require("../controller/favoriteController");

// Routes
router.get("/favorite", getFavorites);
router.get("/favorite/:id", getFavoriteById);
router.post("/favorite", createFavorite);
router.delete("/favorite/:id", deleteFavorite);
router.get("/userFavorite/:id", userFavorites);

// function to get all favorites ---> not needed
async function getFavorites(req, res) {
  try {
    const favorites = await Favorite.read();
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get one favorite ---> not needed
async function getFavoriteById(req, res) {
  try {
    const id = req.params.id;
    const favorite = await Favorite.read(id);
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete a favorite by id
async function deleteFavorite(req, res) {
  try {
    const id = req.params.id;
    const favorite = await Favorite.delete(id);
    res.status(204).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = router;
