"use strict";

const express = require("express");
const router = express.Router();
const { getReplies, createReply, updateReply, deleteReply } = require("../controller/replyController");
// Routes
router.get("/reply", getReplies);
router.post("/reply", createReply);
router.put("/reply/:id", updateReply);
router.delete("/reply/:id", deleteReply);

module.exports = router;
