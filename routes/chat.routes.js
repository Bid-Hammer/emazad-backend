"use strict";
const express = require("express");
const router = express.Router();
const { Chat } = require("../models");


// Chat Routes:

router.get("/chat", async (req, res) => {
  const chat = await Chat.read();
  res.json(chat);
}
);

// get all messages from a specific user
router.get("/chat/:id", async (req, res) => {
    const id = req.params.id;
    const chat = await Chat.read(id);
    res.json(chat);
    }
);

// post a message to a specific user
router.post("/chat/:id", async (req, res) => {
    const id = req.params.id;
    const message = req.body;
    console.log(message)
    const chat = await Chat.sendMessage(id, message);
    res.json(chat);
    }
);

router.delete("/chat/:id", async (req, res) => { 
    const chat = await Chat.destroy({
        where: { id: req.params.id },
    });
    res.json(chat);
    });


    module.exports = router;