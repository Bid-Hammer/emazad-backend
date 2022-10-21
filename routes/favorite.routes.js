"use strict";
const express = require("express");
const router = express.Router();
const { Favorite, userModel, itemModel } = require("../models");

// Routes
router.get("/favorite", getFavorites);
router.get("/favorite/:id", getFavoriteById);
router.get("/favoritelist", getFavoriteList);
router.post("/favorite", createFavorite);
router.delete("/favorite/:id", deleteFavorite);
router.get('/userFavorite/:id', getUserFavorites);

// function to get all favorites
async function getFavorites(req, res) {
  try {
    const favorites = await Favorite.read();
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get one favorite
async function getFavoriteById(req, res) {
  try {
    const id = req.params.id;
    const favorite = await Favorite.read(id);
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to create a favorite
async function createFavorite(req, res) {
  try {
    // user can not add the same item to favorite list more than once
    const favorites = await Favorite.userFavorites(req.body.userID, itemModel);
    const isExist = favorites.some((favorite) => favorite.itemID === req.body.itemID);
    if (isExist) {
      res.status(400).json({ message: "This item is already in your favorite list" });
    } else {
      const favorite = await Favorite.create(req.body);
      res.status(201).json(favorite);
    }
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

// function to get all the favorite list for a all users that have at least one favorite with the item details ---> not needed
async function getFavoriteList(req, res) { 
  try {
    const favorites = await Favorite.favoriteList(userModel, itemModel);
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get all favorites for a user
async function getUserFavorites(req, res) {
  try {
    const favorites = await Favorite.userFavorites(req.params.id, itemModel);
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


module.exports = router;
