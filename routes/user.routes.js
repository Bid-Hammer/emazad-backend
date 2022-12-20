"use strict";
const router = require("express").Router();
const {
  signup,
  login,
  allUsers,
  getUserProfile,
  updateUserProfile,
  userActiveItems,
  userStandByItems,
  userSoldItems,
  userWonItems,
  userEngagedItems,
  verification,
  usersBlocked,
} = require("../controller/userController");
const bearerAuth = require("../middlewares/bearer-auth");
const basicAuth = require("../middlewares/basic-auth");
// const uploadUserImg = require("../middlewares/upload-userImg");

// Routes
router.post("/signup", basicAuth, signup);
router.post("/login", login);
router.get("/users", bearerAuth, allUsers);
router.post("/verification/:id", verification);

router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", bearerAuth, updateUserProfile);

router.get("/userActiveItems/:id", userActiveItems);
router.get("/userStandByItems/:id", userStandByItems);
router.get("/userSoldItems/:id", userSoldItems);
router.get("/userWonItems/:id", userWonItems);
router.get("/userEngagedItems/:id", userEngagedItems);
router.get("/usersBlocked", usersBlocked);

module.exports = router;
