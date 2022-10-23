`use strict`;

const { ratingModel, userModel } = require(`../models`);

const createRating = async (req, res) => {
  try {
    const user = await userModel.findOne({ where: { id: req.body.userId } });
    const ratedUser = await userModel.findOne({
      where: { id: req.body.ratedId },
    });
    const rating = await ratingModel.findOne({
      where: { userId: req.body.userId, ratedId: req.body.ratedId },
    });
    if (user.id === ratedUser.id) {
      res.status(400).json({ message: `You can't rate yourself` });
    }
    if (rating) {
      res.status(400).json({ message: `You already rated this user` });
    }
    res.status(201).json(await ratingModel.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserRating = async (req, res) => {
  try {
    const id = req.params.id;
    const rating = await ratingModel.findAll({ where: { ratedId: id } });
    const averageRating = rating.reduce((acc, curr) => {
      return acc + curr.rating / rating.length;
    }, 0);
    const countRating = rating.length;
    res.status(200).json({ averageRating, countRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRating,
  getUserRating,
};
