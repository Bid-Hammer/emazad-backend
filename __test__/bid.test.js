"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Bid Test', () => {
it('It can create a new bid', async () => {
    const response = await request.post('/bid').send({
        "userID": 1,
        "itemID": 1,
        "bidAmount": 20
    });
    expect(response.status).toEqual(201);
});
});
