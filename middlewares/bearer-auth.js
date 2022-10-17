'use strict';
const User = require('../models').User;

const bearerAuth = async (req, res, next) => {

    if (!req.headers.authorization) {
        next('Invalid Login');
    }

    const token = req.headers.authorization.split(' ').pop();

    try {
        
        const validUser = await User.authenticateToken(token);
        const userInfo = await User.findOne({ where: { email: validUser.email } });
        if (userInfo) {
            req.user = userInfo;
            req.token = userInfo.token;
            next();
        } else {
            next('Invalid Login');
        }

    } catch (error) {
        next(error.message || error);
    }
}

module.exports = bearerAuth;