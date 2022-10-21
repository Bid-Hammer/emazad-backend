"use strict";
const express = require("express");
const router = express.Router();
const { Notification } = require("../models");
const { Op } = require("sequelize");

// Routes
router.get("/notif", getNotifications);
router.get("/notif/:id", getNotificationById);
router.get("/usernotif/:id", getUserNotifications);
router.post("/notif", createNotification);
router.put("/notif/:id", updateNotification);
router.delete("/notif/:id", deleteNotification);

// function to get all notifications
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.readNotification();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get one notification by id
async function getNotificationById(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.readNotification(id, Op);
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to get all notifications for a specific user
async function getUserNotifications(req, res) {
  try {
    const id = req.params.id;
    const notifications = await Notification.readUserNotifications(id, Op);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// function to create a notification
async function createNotification(req, res) {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to update a notification by id
async function updateNotification(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.update(id, req.body);
    res.status(202).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete a notification by id
async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    const notification = await Notification.delete(id);
    res.status(204).json( "Notification Deleted Successfully" );
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// function to delete all notifications after 1 week automatically
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
