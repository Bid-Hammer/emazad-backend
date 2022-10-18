'use strict';
const router = require('express').Router();
const { signup, login, allUsers } = require('../controller/userController');
const bearerAuth = require('../middlewares/bearer-auth');
const basicAuth = require('../middlewares/basic-auth');
const uploadUserImg = require('../middlewares/upload-userImg');


router.post('/signup', uploadUserImg, basicAuth, signup);
router.post('/login', login);
router.get('/users', bearerAuth, allUsers);

module.exports = router;