"use strict";

const express = require("express");
const router = express.Router();
const { Reply, Comment, Notification } = require("../models");

// Routes
router.get("/reply", getReplies);
router.post("/reply", createReply);
router.put("/reply/:id", updateReply);
router.delete("/reply/:id", deleteReply);

// function to get all replies
async function getReplies(req, res) {
  try {
    const replies = await Reply.read();
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to create a reply and send notification to the user who created the comment
async function createReply(req, res) {
  try {
    const reply = await Reply.create(req.body);
    const comment = await Comment.read(reply.commentId);
    await Notification.create({
      userId: comment.userId,
      commentId: comment.id,
      replyId: reply.id,
      notiMessage: `Someone replied to your comment: ${comment.comment}`,
    });
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to update a reply by id
async function updateReply(req, res) {
  try {
    const id = req.params.id;
    const reply = await Reply.update(id, req.body);
    res.status(202).json(reply);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete a reply by id
async function deleteReply(req, res) {
  try {
    const id = req.params.id;
    const reply = await Reply.delete(id);
    res.status(204).json(reply);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = router;
