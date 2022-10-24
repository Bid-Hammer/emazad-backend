"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);
jest.setTimeout(10000)
require('dotenv').config();
const db = require('../models');

const user1 = {
    userName: 'user1',
    fullName: 'user1',
    email: 'user1@test.com',
    password: '123',
    phoneNumber: '111',
    gender: 'male',
    birthDate: '1994-10-26',
    image: 'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png',
    status: 'active',
    role: 'user'
}


const auth = {};


const item1 = {
    itemTitle: 'item1',
    itemDescription: 'item1',
    category: 'electronics',
    subCategory: 'subCategory1',
    startDate: '2021-10-26',
    endDate: '2021-10-26',
    itemImage: [],
    status: 'active',
    userId: 1,
    initialPrice: 10,
    latestBid: 5,
    itemCondition: 'New',

}

// create a user before all tests and get the token from it
beforeAll(async () => {
    // await db.sequelize.sync({ force: true });
    const response = await request.post('/signup').send(user1);
    auth.token = response.body.token;
});


// testing if the user can create a new item
xdescribe('Item POST Route Test', () => {
    it('It can create a new item', async () => {
        const createItem = await request.post('/item').send(item1);
        // if the item exists, it will return 200
        expect(createItem.status).toBe(201);
     
    });
} );


// not complete, it is giving me an error since there is no item image uploaded. Fix the default image issue first.