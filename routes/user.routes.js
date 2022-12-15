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
} = require("../controller/userController");
const bearerAuth = require("../middlewares/bearer-auth");
const basicAuth = require("../middlewares/basic-auth");
// const uploadUserImg = require("../middlewares/upload-userImg");

// Routes
router.post("/signup", basicAuth, signup);
router.post("/login", login);
router.get("/users", bearerAuth, allUsers);
router.post('/verification/:id', verification);

router.get("/profile/:id", bearerAuth, getUserProfile);
router.put("/profile/:id", bearerAuth, updateUserProfile);

router.get("/userActiveItems/:id", bearerAuth, userActiveItems);
router.get("/userStandByItems/:id", bearerAuth, userStandByItems);
router.get("/userSoldItems/:id", bearerAuth, userSoldItems);
router.get("/userWonItems/:id", bearerAuth, userWonItems);
router.get("/userEngagedItems/:id", bearerAuth, userEngagedItems);

module.exports = router;
