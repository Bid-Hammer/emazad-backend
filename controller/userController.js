`use strict`;
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const Users = require('../models/index').User;

const singUp = async (req, res) => {
    try {
        const { userName, fullName, email, password, phoneNumber, gender, birthDate, img, role } = req.body;
        // const hash = await bcrypt.hash(password, 10);
        const data = {
            userName,
            fullName,
            email,
            password,
            phoneNumber,
            gender,
            birthDate,
            img,
            role
        }
        const user = await Users.create(data);
        if (user) {
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    const basicHeader = req.headers.authorization.split(' ');
    const encodedString = basicHeader.pop();
    const decodedString = base64.decode(encodedString);
    const [userName, password] = decodedString.split(':');
    const user = await Users.findOne({ where: { userName } });

    if (user) {
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            res.status(200).json(user);
        } else {
            res.status(403).send('Invalid Login');
        }
    } else {
        res.status(403).send('Invalid Login');
    }
}

const allUsers = async (req, res) => {
    const users = await Users.findAll();
    res.status(200).json(users);
}


module.exports = {
    singUp,
    login,
    allUsers
};