"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Comment Test', () => {
    it('should create a new comment', async () => {
        const response = await request.post('/comment').send({
            "comment": "This is a comment",
            "userID": 1,
            "itemID": 1
        });

        expect(response.status).toBe(200);
        expect(response.body.comment).toEqual("This is a comment");
        expect(response.body.userID).toEqual(1);
        expect(response.body.itemID).toEqual(1);
    })
});
