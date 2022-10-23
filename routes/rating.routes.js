"use strict";
const express = require("express");
const router = express.Router();
const { Rating } = require("../models");
const { createRating, getUserRating } = require("../controller/ratingController");

// Routes
router.get("/rating", getRatings);
router.get("/rating/:id", getRatingById);
router.post("/rating", createRating);
router.put("/rating/:id", updateRating);
router.delete("/rating/:id", deleteRating);
router.get("/userRating/:id", getUserRating);

// function to get all ratings
async function getRatings(req, res) {
  try {
    const ratings = await Rating.read();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get one rating by id
async function getRatingById(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.read(id);
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to update a rating by id
async function updateRating(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.update(id, req.body);
    res.status(202).json(rating);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete a rating by id
async function deleteRating(req, res) {
  try {
    const id = req.params.id;
    const rating = await Rating.delete(id);
    res.status(204).json("Rating Deleted Successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = router;
