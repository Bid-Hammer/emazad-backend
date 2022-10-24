"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

let userId;
let itemId;

describe('Comment Test', () => {
    it('should create a new comments', async () => {

    const response = await request.post('/comment').send({
        comment: "testComment",
        userId: 1,
        itemId: 1
    });
    expect(response.status).toEqual(201);
  
    });
});
