'use strict';
const User = require('../models').User;

const basicAuth = async (req, res, next) => {

    try {
        console.log(req.body);
        const userName = await User.findOne({ where: { userName: req.body.userName } });

        if (userName) {
            return res.status(409).send('The Username alrady token');

        } else {

            const email = await User.findOne({ where: { email: req.body.email } });

            if (email) {

                return res.status(409).send('The Email alrady token');
            }
        }
        next();
    } catch (error) {
        next(error.message || error);
    }
}

module.exports = basicAuth;