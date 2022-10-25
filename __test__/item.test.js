"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);
const db = require('../models');
require('dotenv').config();
jest.setTimeout(10000);

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
// create a user before all tests and get the token from it
// beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//     const response = await request.post('/signup').send(user1);
//     auth.token = response.body.token;
// });




const item1 = {
    itemTitle: 'item1',
    itemDescription: 'item1',
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: 1,
    latestBid: 5,
    initialPrice: 10,
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'active',
    subCategory: 'shoes',
    itemCondition: 'New',
}

const item2 = {
    itemTitle: 'item2',
    itemDescription: 'item2',
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: 1,
    latestBid: 5,
    initialPrice: 10,
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'active',
    subCategory: 'shoes',
    itemCondition: 'Used',
}

// test for creating an item
describe('test item route', () => {

    it('should create an item', async () => {
        const response = await request.post('/item').send(item1)
        // .set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(201);
        expect(response.body.itemTitle).toEqual(item1.itemTitle);
        expect(response.body.itemDescription).toEqual(item1.itemDescription);
        expect(response.body.category).toEqual(item1.category);
        expect(response.body.latestBid).toEqual(item1.latestBid);
        expect(response.body.initialPrice).toEqual(item1.initialPrice);
        expect(response.body.startDate).toEqual(item1.startDate);
        expect(response.body.endDate).toEqual(item1.endDate);
        expect(response.body.status).toEqual(item1.status);
        expect(response.body.subCategory).toEqual(item1.subCategory);
        expect(response.body.itemCondition).toEqual(item1.itemCondition);
    });

    // create new item item2
    it('should create an item', async () => {
        const response = await request.post('/item').send(item1);
        expect(response.status).toEqual(201);
    });


    // test for getting one item by id
    it('should get one item', async () => {
        const response = await request.get('/item/1');
        expect(response.status).toEqual(200);
        expect(response.body.itemTitle).toEqual(item1.itemTitle);
        expect(response.body.itemDescription).toEqual(item1.itemDescription);
        expect(response.body.category).toEqual(item1.category);
        expect(response.body.latestBid).toEqual(item1.latestBid);
        expect(response.body.initialPrice).toEqual(item1.initialPrice);
        expect(response.body.startDate).toEqual(item1.startDate);
        expect(response.body.endDate).toEqual(item1.endDate);
        expect(response.body.status).toEqual(item1.status);
        expect(response.body.subCategory).toEqual(item1.subCategory);
        expect(response.body.itemCondition).toEqual(item1.itemCondition);
    });


    // test hiding an item by id 
    it('should hide an item', async () => {
        const response = await request.put('/itemhide/1');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([1]);
    });


    // check the status of the item after hiding it
    it('should get one item', async () => {
        const response = await request.get('/item/1');
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('deleted');
    });


    // test for getting all items
    it('should get all items', async () => {
        const response = await request.get('/items');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
    });


    // test for getting all items by status
    it('should get all items by status', async () => {
        const response = await request.get('/items/active');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].status).toEqual('active');
    });


    // test for getting all items by status and category 
    it('should get all items by status and category', async () => {
        const response = await request.get('/items/active/clothes');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].status).toEqual('active');
        expect(response.body[0].category).toEqual('clothes');
    });


    // test for getting all items by status and category and subCategory
    it('should get all items by status and category and subCategory', async () => {
        const response = await request.get('/items/active/clothes/shoes');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].subCategory).toEqual('shoes');
    });


    // teet route not found 
    it('should get all items by status and category and subCategory and itemCondition', async () => {
        const response = await request.get('/items/active/clothes/shoes/New');
        expect(response.status).toEqual(404);

    });

    // update item 
    it('should update an item', async () => {
        const response = await request.put('/item/1').send(item2);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([1]);

    });

    // check the updated item 
    it('should get one item', async () => {
        const response = await request.get('/item/1');
        expect(response.status).toEqual(200);
        expect(response.body.itemTitle).toEqual(item2.itemTitle);
        expect(response.body.itemDescription).toEqual(item2.itemDescription);
        expect(response.body.category).toEqual(item2.category);
        expect(response.body.latestBid).toEqual(item2.latestBid);
        expect(response.body.initialPrice).toEqual(item2.initialPrice);
        expect(response.body.startDate).toEqual(item2.startDate);
        expect(response.body.endDate).toEqual(item2.endDate);
        expect(response.body.status).toEqual(item2.status);
        expect(response.body.subCategory).toEqual(item2.subCategory);
        expect(response.body.itemCondition).toEqual(item2.itemCondition);
    });

    // test for getting all items by status and category and subCategory and itemCondition
    it('should get all items by status and category and subCategory and itemCondition', async () => {
        const response = await request.get('/items/all');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
    });

    // test for getting all items by status and category and subCategory and itemCondition
    it('should get all items by status and category and subCategory and itemCondition', async () => {
        const response = await request.get('/items/all/clothes');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
    });

    // grt one by id not found
    it('should get one item', async () => {
        const response = await request.get('/item/5');
        expect(response.body).toEqual(null);
    });

    // test deleting an item by id
    xit('should delete an item', async () => {
        const response = await request.delete('/item/1');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([1]);
    });



});


