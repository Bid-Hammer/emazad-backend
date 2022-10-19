"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Item Test', () => { 
//  it('It can create a new item', async () => {
//     const response = await request.post('/item').send({
//         itemTitle: "Test Item",
//         itemDescription: "Test Item Description",
//         itemCat: "Pets",
//         userID: 1,
//         latestBid: 0,
//         initialPrice: 20,
//         startDate: "1/1/2022",
//         endDate: "1/1/2023"
//  });
//  expect(response.status).toEqual(201);
// });

it('It can get all items', async () => {
    const response = await request.get('/items');
    expect(response.status).toEqual(200);

});

it('It can get an item by id', async () => {
    const response = await request.get('/items/1');
    expect(response.status).toEqual(200);
});

// it('It can delete an item by id', async () => {
//     const response = await request.delete('/items/1');
//     expect(response.status).toEqual(200);
// });

});