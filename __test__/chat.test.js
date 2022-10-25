'use strict';

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);


require('dotenv').config();
const db = require('../models');

const user1 = {
    userName: 'user11',
    fullName: 'user11',
    email: 'user11@test.com',
    password: '123',
    phoneNumber: '1111',
    gender: 'male',
    birthDate: '1994-10-26',
    image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
    status: 'active',
    role: 'user'
}


const user2 = {
    userName: 'user22',
    fullName: 'user22',
    email: 'user2@test.com',
    password: '123',
    phoneNumber: '2222',
    gender: 'female',
    birthDate: '1998-10-26',
    image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
    status: 'active',
    role: 'user'


}

const auth = {};

// create a user before all tests and get the token from it
beforeAll(async () => {
    // await db.sequelize.sync({ force: true });
    const response = await request.post('/signup').send(user1);
    const response2 = await request.post('/signup').send(user2);

    const token1 = auth.token = response.body.token;
    const token2 = auth.token = response2.body.token;

});


xdescribe('Chat Test', () => {
    it('should create a new chat', async () => {
        const response = await request.post('/chat').send({
            "senderId": 1,
            "message": "This is a message",
            "receiverId": 2
        });

        expect(response.status).toBe(201);
        expect(response.body.senderId).toEqual(1);
        expect(response.body.receiverId).toEqual(2);
    }
    );

    it('should get all chats', async () => {
        const response = await request.get('/chat/1/2');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});


// Chat Test Done. Do NOT touch this file. Thanks for NOT touching this file.
