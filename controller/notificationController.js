`use strict`;

const { notificationModel } = require(`../models`);

const getNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    let notifications;
    id
      ? (notifications = await notificationModel.findOne({ where: { id: id } }))
      : (notifications = await notificationModel.findAll());
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    const notifications = await notificationModel.findAll({
      where: { userId: id },
    });
    const sortedNotifications = notifications.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.status(200).json(sortedNotifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await notificationModel.findOne({ where: { id: id } });
    await notification.update({ status: "read" });
    res.status(202).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  getNotifications,
  getUserNotifications,
  updateNotification,
};
