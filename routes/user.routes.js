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
  verfication,
} = require("../controller/userController");
const bearerAuth = require("../middlewares/bearer-auth");
const basicAuth = require("../middlewares/basic-auth");
const uploadUserImg = require("../middlewares/upload-userImg");

// Routes
router.post("/signup", uploadUserImg, basicAuth, signup);
router.post("/login", login);
router.get("/users", bearerAuth, allUsers);
router.post('/verfication/:id', verfication);

router.get("/profile/:id", bearerAuth, getUserProfile);
router.put("/profile/:id", uploadUserImg, bearerAuth, updateUserProfile);

router.get("/userActiveItems/:id", bearerAuth, userActiveItems);
router.get("/userStandByItems/:id", bearerAuth, userStandByItems);
router.get("/userSoldItems/:id", bearerAuth, userSoldItems);
router.get("/userWonItems/:id", bearerAuth, userWonItems);
router.get("/userEngagedItems/:id", bearerAuth, userEngagedItems);

module.exports = router;
