"use strict";

const express = require("express");
const router = express.Router();
const { getReplies, createReply, updateReply, deleteReply } = require("../controller/replyController");
const bearerAuth = require("../middlewares/bearer-auth");

// Routes
router.get("/reply", getReplies);
router.post("/reply", bearerAuth, createReply);
router.put("/reply/:id", bearerAuth, updateReply);
router.delete("/reply/:id", bearerAuth, deleteReply);

module.exports = router;
