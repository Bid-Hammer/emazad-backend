'use strict';

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

require('dotenv').config();
const db = require('../models');

describe('Chat Test', () => {
    const user1 = {
        userName: 'userChat1',
        fullName: 'userChat1',
        email: 'userChat1@test.com',
        password: '123',
        phoneNumber: '2',
        gender: 'male',
        birthDate: '1994-10-26',
        image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
        status: 'active',
        role: 'user'
    }
    
    const user2 = {
        userName: 'userChat2',
        fullName: 'userChat2',
        email: 'userChat2@test.com',
        password: '123',
        phoneNumber: '22',
        gender: 'female',
        birthDate: '1998-10-26',
        image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
        status: 'active',
        role: 'user'
    }
    
    const users = {};
    
    // create a user before all tests and get the token from it
    beforeAll(async () => {
        const response = await request.post('/signup').send(user1);
        const response2 = await request.post('/signup').send(user2);
        users.user1 = response.body;
        users.user2 = response2.body;
    });

    it('should create a new chat', async () => {
        const response = await request.post('/chat').send({
            senderId: users.user1.id,
            message: "This is a Test message",
            receiverId: users.user2.id
        });

        expect(response.status).toBe(201);
        expect(response.body.senderId).toEqual(users.user1.id);
        expect(response.body.receiverId).toEqual(users.user2.id);
    }
    );

    it('should get all chats', async () => {
        const response = await request.get(`/chat/${users.user1.id}/${users.user2.id}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});


// Chat Test Done. Do NOT touch this file. Thanks for NOT touching this file.
