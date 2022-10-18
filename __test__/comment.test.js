// "use strict";

// const server = require('../server');
// const supertest = require('supertest');
// const request = supertest(server.app);

// let userID;
// let itemID;

// describe('Comment Test', () => {
//     it('should create a new comment', async () => {
    // create a user and an item to test the comment

    // const user = await request.post('/signup').send({
    //     "userName":"testUser",
    //     "fullName":"testFullName",
    //     "email":"test@test.com",
    //     "password": "123",
    //     "phoneNumber": 123456789,
    //     "gender":"male",
    //     "birthDate":"2/5/2200"
    // });

    // userID = user.body.id;

    // const item = await request.post('/item').send({
    //     "itemTitle": "testItem",
    //     "itemDescription": "testDescription",
    //     "itemCat": "testCategory",
    //     "userID": `${userID}`,
    //     "latestBid": "321",
    //     "initialPrice": "321",
    //     "startDate": "1/1/1111",
    //     "endDate": "1/2/1111"
    // });

    // itemID = item.body.id;

    // const response = await request.post('/comment').send({
    //     "comment": "testComment",
    //     "userID": "1",
    //     "itemID": "2"
    // });

    // expect(response.status).toBe(201);
    // expect(response.body.comment).toEqual("testComment");
    // expect(response.body.userID).toEqual(userID);
    // expect(response.body.itemID).toEqual(itemID);
//     });
// });
