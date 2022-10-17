"use strict";

const express = require("express");
const router = express.Router();

const { Favorite } = require("../models");

router.get("/favorite", getFavorites);
router.get("/favorite/:id", getFavoriteById);
router.post("/favorite", createFavorite);
router.put("/favorite/:id", updateFavorite);
router.delete("/favorite/:id", deleteFavorite);

async function getFavorites(req, res) {
  try {
    const favorites = await Favorite.read();
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function getFavoriteById(req, res) {
  try {
    const id = req.params.id;
    const favorite = await Favorite.read(id);
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function createFavorite(req, res) {
  try {
    const favorite = await Favorite.create(req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function updateFavorite(req, res) {
  try {
    const id = req.params.id;
    const favorite = await Favorite.update(id, req.body);
    res.status(202).json(favorite);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

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
