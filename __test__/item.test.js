"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

// testing if the user can create a new item
describe('Item POST Route Test', () => {
    it('It can create a new item', async () => {
        const createItem = await request.post('/item').send({
            "itemTitle": "item1",
            "itemDescription": "description1",
            "category": "category1",
            "userId": 4,
            "initialPrice": 10,
            "latestBid": 1,
            "status": "new",
            "startDate": "2021-05-01",
            "endDate": "2021-05-02",
            "itemCondition": "new",
            "subCategory": "Phones"

        });
        // if the item exists, it will return 200
        expect(createItem.status).toBe(201);
     
    });
} );


// not complete, it is giving me an error since there is no item image uploaded. Fix the default image issue first.