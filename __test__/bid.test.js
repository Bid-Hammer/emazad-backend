"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Bid GET Routes Test', () => {
    it('It can get all bids', async () => {
        const response = await request.get('/bid');
        expect(response.status).toBe(200);
    });
    it('It can get a specific bid', async () => {
        const response = await request.get(`/bid/${1}`);
        expect(response.status).toBe(200);
    });
});
// // describe('Bid POST Route Test', () => {

// //     it('It can create a new bid', async () => {
// //         const createBid = await request.post('/bid').send({
// //             "userID": 1,
// //             "itemID": 1,
// //             "bidprice": 10

// //         });
// //         // if the item exists, it will return 200
// //         expect(createBid.status).toBe(201);
// //         // if the item does not exist, it will return 404
// //         expect(createBid.status).not.toBe(404);

// //     });
// });
