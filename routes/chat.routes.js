"use strict";
const express = require("express");
const router = express.Router();
const { getChat, sendChat } = require("../controller/chatController");

router.get("/chat/:senderId/:receiverId", getChat);
router.post("/chat", sendChat);

module.exports = router;
