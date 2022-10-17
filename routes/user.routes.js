'use strict';
const router = require('express').Router();
const { signup, login, allUsers } = require('../controller/userController');
const bearerAuth = require('../middlewares/bearer-auth');
const basicAuth = require('../middlewares/basic-auth');

router.post('/signup', basicAuth, signup);
router.post('/login', login);
router.get('/users', bearerAuth, allUsers);

module.exports = router;