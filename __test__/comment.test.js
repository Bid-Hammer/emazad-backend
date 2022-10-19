"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

let userID;
let itemID;

describe('Comment Test', () => {
    it('should create a new comment', async () => {
    // create a user and an item to test the comment

    // const user = await request.post('/signup').send({
    //     "userName": "omar",
    //         "fullName": "omar",
    //         "email": "omar@gmail.com",
    //         "password": "1234",
    //         "phoneNumber": 123,
    //         "gender": "male",
    //         "birthDate": "1999-12-12",
    //         "image": "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
    // });

    // userID = user.body.id;

    // const item = await request.post('/item').send({
    //     "itemTitle": "testItem",
    //     "itemDescription": "testDescription",
    //     "itemImage": "https://www.mub.eps.manchester.ac.uk/ceasblog/wp-content/themes/uom-theme/assets/images/default-thumbnail.jpg",
    //     "itemCat": "testCategory",
    //     "userID": `${userID}`,
    //     "latestBid": "321",
    //     "initialPrice": "321",
    //     "startDate": "1/1/1111",
    //     "endDate": "1/2/1111"
    // });

    // itemID = item.body.id;

    const response = await request.post('/comment').send({
        "comment": "testComment",
        "userID": 1,
        "itemID": 1
    });

    // expect(user.status).toBe(201);
    // expect(item.status).toEqual(201);
    expect(response.status).toEqual(201);
    // expect(response.body.comment).toEqual("testComment");
    // expect(response.body.userID).toEqual(userID);
    // expect(response.body.itemID).toEqual(itemID);
    });
});
