"use strict";

const express = require("express");
const router = express.Router();
const { Comment, Item, Notification } = require("../models");

// Routes
router.get("/comment", getComments);
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

// function to create a comment and send notification to the user who created the post
async function createComment(req, res) {
  try {
    const comment = await Comment.create(req.body);
    const item = await Item.read(comment.itemId);
    await Notification.create({
      userId: item.userId,
      itemId: item.id,
      commentId: comment.id,
      notiMessage: `Someone commented on your item: ${item.itemTitle}`,
    });
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
