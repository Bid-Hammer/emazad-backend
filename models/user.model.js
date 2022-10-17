'use strict';

const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        gender: {
            type: DataTypes.ENUM("male", "female"),
        },
        birthDate: {
            // type: DataTypes.DATEONLY,
            type: DataTypes.STRING,
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
            // defaultValue: where => {
            //     gender.toLowerCase().includes('male') ? 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png' : 'https://png.pngitem.com/pimgs/s/4-40070_user-staff-man-profile-user-account-icon-jpg.png'
        },
        status: {
            type: DataTypes.ENUM("active", "inactive", "blocked"),
            allowNull: false,
            defaultValue: "active",
        },
        token: {
            type: DataTypes.VIRTUAL,
            get() {
                return jwt.sign({ email: this.email }, process.env.JWT_SECRET);
            },
            set(tokenObj) {
                return jwt.sign(tokenObj, process.env.JWT_SECRET);
            },
        },
        role: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
            defaultValue: "user"
        },
        capabilities: {
            type: DataTypes.VIRTUAL,
            get() {
                const acl = {
                    user: ['read, create'],
                    admin: ['read', 'create', 'update', 'delete'],
                }
                return acl[this.role];
            }
        }
    });

    User.authenticateToken = (token) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return err;
            } else {
                return decoded;
            }
        });
    };

    return User;
};