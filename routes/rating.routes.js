"use strict";

const express = require("express");
const router = express.Router();

const Rating = require("../models/rating.model");

router.get("/rating", getRatings);
router.get("/rating/:id", getRatingById);
router.post("/rating", createRating);
router.put("/rating/:id", updateRating);
router.delete("/rating/:id", deleteRating);

async function getRatings(req, res) {
  try {
    const ratings = await Rating.read();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function getRatingById(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.read(id);
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function createRating(req, res) {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function updateRating(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.update(id, req.body);
    res.status(202).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

async function deleteRating(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.delete(id);
    res.status(204).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = router;
