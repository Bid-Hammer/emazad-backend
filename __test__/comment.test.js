"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Comment Test', () => {
    it('should create a new comment if the user is active', async () => {

    const response = await request.post('/comment').send({
        
        "userID": 1,
        "itemID": 1,
        "comment": "testing the comment"
    });
    expect(response.status).toEqual(201);
    });
});
