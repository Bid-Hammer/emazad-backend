"use strict";
const express = require("express");
const router = express.Router();
const { Chat, userModel } = require("../models");

router.get("/chat/:senderId/:receiverId", getChat);
router.post("/chat", sendChat);

 async function getChat(req, res, next) {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        const chat = await Chat.getChatMessages(senderId, receiverId);
        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
}


async function sendChat (req, res, next) {
  try {
    const chat = await Chat.createChat( req.body, userModel);
    res.status(201).json(chat);
  } catch (e) {
    next(e);
  }
}


    module.exports = router;