"use strict";
const express = require("express");
const router = express.Router();
const { Notification } = require("../models");
const { Op } = require("sequelize");

router.get("/notif", getNotifications);
router.get("/notif/:id", getNotificationById);
router.get("/usernotif/:id", getUserNotifications);
router.post("/notif", createNotification);
router.put("/notif/:id", updateNotification);
router.delete("/notif/:id", deleteNotification);


async function getNotifications(req, res) {
  try {
    const notifications = await Notification.readNotification();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


async function getNotificationById(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.readNotification(id, Op);
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


async function getUserNotifications(req, res) {
  try {
    const id = req.params.id;
    const notifications = await Notification.readUserNotifications(id, Op);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function createNotification(req, res) {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


async function updateNotification(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.update(id, req.body);
    res.status(202).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.delete(id);
    res.status(204).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}


setInterval(async () => {
  try {
    const notifications = await Notification.read();
    notifications.forEach(async (notification) => {
      const time = new Date().getTime() - notification.createdAt;
      if (time > 7 * 24 * 60 * 60 * 1000) {
        await Notification.hide(notification.id);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}, 1 * 24 * 60 * 60 * 1000);


module.exports = router;
