"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

let userID;
let itemID;

describe('Comment Test', () => {
    it('should create a new comments', async () => {
    itemID = item.body.id;

    const response = await request.post('/comment').send({
        "comment": "testComment",
        "userID": 1,
        "itemID": 1
    });
    expect(response.status).toEqual(201);
  
    });
});
