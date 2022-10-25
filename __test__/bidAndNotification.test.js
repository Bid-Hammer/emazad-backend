"use strict";
const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);
const db = require('../models');
require('dotenv').config();


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
const user2 = {
    userName: 'user2',
    fullName: 'user2',
    email: 'user2@test.com',
    password: '123',
    phoneNumber: '222',
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
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: '1',
    latestBid: '5',
    initialPrice: '10',
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'active',
    subCategory: 'shoes',
    itemCondition: 'New',
}
const item3 = {
    itemTitle: 'item1',
    itemDescription: 'item1',
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: '1',
    latestBid: '5',
    initialPrice: '10',
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'sold',
    subCategory: 'shoes',
    itemCondition: 'New',
}
const item4 = {
    itemTitle: 'item1',
    itemDescription: 'item1',
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: '1',
    latestBid: '5',
    initialPrice: '10',
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'standby',
    subCategory: 'shoes',
    itemCondition: 'New',
}
const item5 = {
    itemTitle: 'item1',
    itemDescription: 'item1',
    itemImage: ['https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'],
    category: 'clothes',
    userId: '1',
    latestBid: '5',
    initialPrice: '10',
    startDate: '2021-10-26T00:00:00.000Z',
    endDate: '2025-10-26T00:00:00.000Z',
    status: 'expired',
    subCategory: 'shoes',
    itemCondition: 'New',
}
// create a user before all tests and get the token from it
// beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//     const response = await request.post('/signup').send(user1);
//     const response2 = await request.post('/signup').send(user2);
//     const item = await request.post('/item').send(item1);
//     const item2 = await request.post('/item').send(item1);
//     const itemSold = await request.post('/item').send(item3);
//     const itemStandby = await request.post('/item').send(item4);
//     const itemExpired = await request.post('/item').send(item5);
//     auth.token = response.body.token;
// });


describe('test bid route', () => {

    // crate a new bid for bid lower than or equal the initial price 
    it('crate a new bid for bid lower than or equal the initial price', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 2,
            bidprice: 9,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('first bid should be higher than the initial price');

    });


    // bid for your item
    it('bid for your item', async () => {
        const response = await request.post('/bid').send({
            userId: 1,
            itemId: 2,
            bidPrice: 10,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('You can not bid on your own item');
    });

    // bid higher than the initial price
    it('bid higher than the latest bid and initial price', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 2,
            bidprice: 40,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(201);
    });

    // bid lower than the latest bid
    it('bid lower than the latest bid', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 2,
            bidprice: 20,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Your bid price is lower than the latest bid");
    });

    // bid for sold item
    it('bid for sold item', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 3,
            bidprice: 90,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('This item is already sold');
    });
    // bid for item expired
    it('bid for item expired', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 5,
            bidprice: 90,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('This item is already sold');
    });

    // bid for standby item
    it('bid for standby item', async () => {
        const response = await request.post('/bid').send({
            userId: 2,
            itemId: 4,
            bidprice: 90,
        }).set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('The auction for this item has not started yet');
    });

    // git all bids for item
    it('git all bids for item', async () => {
        const response = await request.get('/bid/2').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
    });

    // git one bid by id
    it('git one bid by id', async () => {
        const response = await request.get('/bid/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
    });

    // get nofication for user 
    it('get nofication for user', async () => {
        const response = await request.get('/usernotif/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
    });

    // ERROR 500 get nofication for user for id dosent exist
    it(' error get nofication for user', async () => {
        const response = await request.get('/usernotif/5.5').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // get all nofication 
    it('get all nofication', async () => {
        const response = await request.get('/notif').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(200);
    });


    // update nofication 
    it('update nofication', async () => {
        const response = await (await request.put('/notif/1'));
        // .set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(202);
    });

    // ERROR 500 update nofication
    it('update nofication', async () => {
        const response = await (await request.put('/notif/5.5'));
        // .set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(500);
    });

    // delete nofication
    it('delete nofication', async () => {
        const response = await request.delete('/notif/1').set('Authorization', `Bearer ${auth.token}`);
        expect(response.status).toEqual(204);
    });


    // create nofication 
    it('create nofication', async () => {
        const response = await request.post('/notif').send({
            userID: 1,
            itemID: 1,
            notiMessage: "bla bla",
            status: "read"
        });
        expect(response.status).toEqual(201);
    });



});
