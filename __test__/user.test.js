"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);
const db = require('../models');
require('dotenv').config();

const user1 = {
    userName: 'user1',
    fullName: 'user1',
    email: 'user1@test.com',
    password: '123',
    phoneNumber: '111',
    gender: 'male',
    birthDate: '1994-10-26',
    image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
    status: 'active',
    role: 'user'
}

const auth = {};

// create a user before all tests and get the token from it
// beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//     const response = await request.post('/signup').send(user1);
//     auth.token = response.body.token;
// });

describe('User Tests', () => {

    // testing the signup route --works only once
    it('should create a new user', async () => {

        const user2 = { ...user1, userName: 'user2', fullName: 'user2', email: 'user2@test.com', phoneNumber: '222' };
        const response = await request.post('/signup').send(user2);
        expect(response.status).toEqual(201);
        expect(response.body.userName).toEqual('user2');
        expect(response.body.fullName).toEqual('user2');
        expect(response.body.email).toEqual('user2@test.com');
        expect(response.body.phoneNumber).toEqual('222');
        expect(response.body.gender).toEqual('male');
        expect(response.body.birthDate).toEqual('1994-10-26');
        expect(response.body.status).toEqual('active');
        expect(response.body.role).toEqual('user');
    });

    // testing the signup route with an existing username
    it('should not create a new user with existing username', async () => {

        const response = await request.post('/signup').send(user1);
        expect(response.status).toEqual(409);
        expect(response.text).toEqual('Username already exists');
    });

    // testing the signup route with an existing email
    it('should not create a new user with existing email', async () => {

        const user = { ...user1, userName: 'userTest', phoneNumber: '123123' };

        const response = await request.post('/signup').send(user);
        expect(response.status).toEqual(409);
        expect(response.text).toEqual('Email already exists');
    });

    // testing the signup route with an existing phone number
    it('should not create a new user with existing phone number', async () => {

        const user = { ...user1, userName: 'user3', email: 'user3@test.com' };

        const response = await request.post('/signup').send(user);
        expect(response.status).toEqual(409);
        expect(response.text).toEqual('Phone number already exists');
    });

    // testing logging in without verifying the email first
    it('should not log in without verifying the email', async () => {

        const response = await request.post('/login').auth('user1', '123');
        expect(response.status).toEqual(400);
        expect(response.text).toEqual('Please Verify Your Email!');
    });

    // testing the verification route for an existing user by sending the email and password
    it('should verify a new user', async () => {

        const response = await request.post('/verification/1').auth('user1', '123');
        expect(response.status).toEqual(200);
    });

    // testing the login route
    it('should login an active user', async () => {

        const response = await request.post('/login').auth('user1', '123');
        expect(response.status).toEqual(200);
        expect(response.body.userName).toEqual('user1');
        expect(response.body.fullName).toEqual('user1');
        expect(response.body.email).toEqual('user1@test.com');
        expect(response.body.phoneNumber).toEqual('111');
        expect(response.body.gender).toEqual('male');
        expect(response.body.birthDate).toEqual('1994-10-26');
        expect(response.body.status).toEqual('active');
        expect(response.body.role).toEqual('user');
    });

    // testing the login route with a blocked user
    it('should not login a blocked user', async () => {

        const user = { ...user1, userName: 'user3', email: 'user3@test.com', phoneNumber: '333', status: 'blocked' };
        await request.post('/signup').send(user);
        const response = await request.post('/login').auth('user3', '123');
        expect(response.status).toEqual(403);
        expect(response.text).toEqual('Invalid Login');
    });

    // testing the login route with an invalid username
    it('should not login with an invalid username', async () => {

        const response = await request.post('/login').auth('noUser', '123');
        expect(response.status).toEqual(403);
        expect(response.text).toEqual('Invalid Login');
    });

    // testing the login route with a wrong password
    it('should not login a user with a wrong password', async () => {

        const response = await request.post('/login').auth('user1', '1234');
        expect(response.status).toEqual(403);
        expect(response.text).toEqual('Invalid Login');
    });

    // testing the get all users route without token
    it('should not get all users without a token', async () => {

        const response = await request.get('/users').set('Authorization', `Bearer`);
        expect(response.status).toEqual(500);
    });

    // testing the get all users route with token from the beforeAll function
    it('should get all users with a token', async () => {

        const response = await request.get('/users').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(1);
    });

    // testing to get a user profile with a token from the beforeAll function
    it('should get the profile of a user with a token', async () => {

        const response = await request.get('/profile/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.userName).toEqual('user1');
    });

    // testing updating the profile in the profile route with token from the beforeAll function
    it('should update the profile of a user with a token', async () => {

        const updatedUser = { ...user1, userName: 'updatedUser' };
        const response = await request.put('/profile/1').set('Authorization', `Bearer ${auth.token}`).send(updatedUser);
        expect(response.status).toEqual(202);
        expect(response.body.userName).toEqual('updatedUser');
    });

    // testing getting the userActiveItems route with token from the beforeAll function
    it('should get the active items of a user with a token', async () => {

        const response = await request.get('/userActiveItems/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });

    // testing getting the userStandbyItems route with token from the beforeAll function
    it('should get the standby items of a user with a token', async () => {

        const response = await request.get('/userStandbyItems/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });

    // testing getting the userSoldItems route with token from the beforeAll function
    it('should get the sold items of a user with a token', async () => {

        const response = await request.get('/userSoldItems/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });

    // testing getting the userWonItems route with token from the beforeAll function
    it('should get the won items of a user with a token', async () => {

        const response = await request.get('/userWonItems/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });

    // testing getting the userEngagedItems route with token from the beforeAll function
    it('should get the engaged items of a user with a token', async () => {

        const response = await request.get('/userEngagedItems/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });


    // ERRPR HANDLING TESTS

    // testing getting error 500 when trying to logging in with a wrong data type
    it('should get server error (500) when trying to login without any data', async () => {

        const response = await request.post('/login');
        expect(response.status).toEqual(500);
    });

    // testing getting error 500 when trying to get a user profile with a wrong data type
    it('should get server error (500) when trying to get a user profile with a wrong data type', async () => {

        const response = await request.get('/profile/1.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // testing getting error 500 when updating a user profile with a wrong data type
    it('should get server error (500) when updating a user profile with a wrong data type', async () => {

        const response = await request.put('/profile/1.5').set('Authorization', `Bearer ${auth.token}`).send(user1);
        expect(response.status).toEqual(500);
    });

    // testing getting error 500 when trying to get a user active items with a wrong data type
    it('should get server error (500) when trying to get a user active items with a wrong data type', async () => {

        const response = await request.get('/userActiveItems/1.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // testing getting error 500 when trying to get a user standby items with a wrong data type
    it('should get server error (500) when trying to get a user standby items with a wrong data type', async () => {

        const response = await request.get('/userStandbyItems/1.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // testing getting error 500 when trying to get a user sold items with a wrong data type
    it('should get server error (500) when trying to get a user sold items with a wrong data type', async () => {

        const response = await request.get('/userSoldItems/1.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // // testing getting error 500 when trying to get a user won items with a wrong data type
    // it('should get server error (500) when trying to get a user won items with a wrong data type', async () => {

    //     const response = await request.get('/userWonItems/1.5').set('Authorization', `Bearer ${auth.token}`);
    //     expect(response.status).toEqual(500);
    // });

    // testing getting error 500 when trying to get a user engaged items with a wrong data type
    it('should get server error (500) when trying to get a user engaged items with a wrong data type', async () => {

        const response = await request.get('/userEngagedItems/1.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // testing getting error 404 when trying to get a user profile with a wrong id
    it('should get bad request error (404) when trying to get a user profile with a wrong id', async () => {

        const response = await request.get('/profile/').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(404);
    });

    // testing getting error 403 when trying to verify a user with a wrong email and password
    it('should get forbidden error (403) when trying to verify a user with a wrong email and password', async () => {

        const response = await request.post('/verification/1').auth('wrongEmail', 'wrongPassword');
        expect(response.status).toEqual(403);
        expect(response.text).toEqual('Invalid Login');
    });

});
