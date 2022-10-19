"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Verify Bid get routs', () => {
it('test to get all bids, should response with 200 status code ', async () => {
    const response = await request.get('/bid');
    expect(response.status).toBe(200);
});
it('test to get one bid, should response with 200 status code ', async () => {
    const response = await request.get(`/bid/${1}`);
    expect(response.status).toBe(200);
});
});
describe('Bid Test', () => {
    // it('It can create a new user', async () => {
    //     const register = await request.post('/signup').send({
    //         "userName": "omar",
    //         "fullName": "omar",
    //         "email": "omar@gmail.com",
    //         "password": "1234",
    //         "phoneNumber": 123,
    //         "gender": "male",
    //         "birthDate": "1999-12-12",
    //         "image": "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
    //     });
    //     expect(register.status).toEqual(201);
    // });
    // it('It can create a new item', async () => {
    //     const userItem = await request.post('/item').send({
    //         "itemTitle": "pets",
    //         "itemDescription": "cat",
    //         "itemImage": "https://www.mub.eps.manchester.ac.uk/ceasblog/wp-content/themes/uom-theme/assets/images/default-thumbnail.jpg",
    //         "itemCat": "Pets",
    //         "userID": 1,
    //         "latestBid": 10,
    //         "initialPrice": 100,
    //         "startDate": "1/1/2022",
    //         "endDate": "1/1/2025"
    //     });
    //     expect(userItem.status).toEqual(201);
    // });
    it('It can create a new bid', async () => {
        const createBid = await request.post('/bid').send({
            "userID": 1,
            "itemID": 1,
            "bidprice": 10
           
        });
        expect(createBid.status).toBe(201);
    });
    });
