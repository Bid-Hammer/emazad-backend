"use strict";

const express = require("express");
const router = express.Router();
const { Comment } = require("../models");

// Routes
router.get("/comment", getComments);
router.get("/comment/:id", getCommentById);
router.post("/comment", createComment);
router.put("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);

// function to get all comments
async function getComments(req, res) {
  try {
    const comments = await Comment.read();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get one comment
async function getCommentById(req, res) {
  try {
    const id = req.params.id;
    const comment = await Comment.read(id);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to create a comment
async function createComment(req, res) {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to update a comment by id
async function updateComment(req, res) {
  try {
    const id = req.params.id;
    const comment = await Comment.update(id, req.body);
    res.status(202).json(comment);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete a comment by id
async function deleteComment(req, res) {
  try {
    const id = req.params.id;
    const comment = await Comment.delete(id);
    res.status(204).json(comment);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = router;
