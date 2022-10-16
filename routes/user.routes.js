'use strict';
const router = require('express').Router();
const { singUp, login, allUsers } = require('../controllers/userController');
const bearerAuth = require('../middlewares/bearer-auth');
const basicAuth = require('../middlewares/basic-auth');

router.post('/signup', basicAuth, singUp);
router.post('/login', login);
router.get('/users', bearerAuth, allUsers);

module.exports = router;