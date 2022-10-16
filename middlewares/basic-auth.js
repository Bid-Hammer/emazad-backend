'use strict';
const User = require('../models').db.User;

const basicAuth = async (req, res, next) => {

    try {

        const userName = await User.findOne({ where: { userName: req.params.userName } });

        if (userName) {
            return res.status(409).send('The Username alrady token');

        } else {

            const email = await User.findOne({ where: { email: req.params.email } });

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