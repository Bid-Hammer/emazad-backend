'use strict';
const router = require('express').Router();
const { signup, login, allUsers, getUserProfile, updateUserProfile, soldItems, wonItems } = require('../controller/userController');
const bearerAuth = require('../middlewares/bearer-auth');
const basicAuth = require('../middlewares/basic-auth');
const uploadUserImg = require('../middlewares/upload-userImg');


router.post('/signup', uploadUserImg, basicAuth, signup);
router.post('/login', login);
router.get('/users', bearerAuth, allUsers);

router.get('/profile/:id', bearerAuth, getUserProfile);
router.put('/profile/:id', uploadUserImg, bearerAuth, updateUserProfile);
router.get('/soldItems/:id', bearerAuth, soldItems);
router.get('/wonItems/:id', bearerAuth, wonItems);



module.exports = router;