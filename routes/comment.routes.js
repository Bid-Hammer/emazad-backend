"use strict";

const express = require("express");
const router = express.Router();
const { getComments, createComment, updateComment, deleteComment } = require("../controller/commentController");

// Routes
router.get("/comment", getComments);
router.get("/comment/:id", getComments);
router.post("/comment", createComment);
router.put("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);

module.exports = router;
