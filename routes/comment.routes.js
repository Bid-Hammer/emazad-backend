"use strict";

const express = require("express");
const router = express.Router();
const { getComments, createComment, updateComment, deleteComment } = require("../controller/commentController");
const bearerAuth = require("../middlewares/bearer-auth");

// Routes
router.get("/comment", getComments);
router.get("/comment/:id", getComments);
router.post("/comment", bearerAuth, createComment);
router.put("/comment/:id", bearerAuth, updateComment);
router.delete("/comment/:id", bearerAuth, deleteComment);

module.exports = router;
