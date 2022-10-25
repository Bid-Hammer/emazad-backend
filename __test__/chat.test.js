'use strict';

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

xdescribe('Chat Test', () => {
    it( 'should create a new chat', async () => {
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