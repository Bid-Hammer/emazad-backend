"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Notification Test', () => {
    describe('Notification Test get Notification', () => {
        it('test to get all Notifications, should response with 200 status code ', async () => {
            const response = await request.get('/notif');
            expect(response.status).toBe(200);
        });
        
        it('test to get one Notification, should response with 200 status code ', async () => {
            const response = await request.get(`/notif/${1}`);
            expect(response.status).toBe(200);
        });
    });
    describe('Verify Notification post routs', () => {
        it('test to create a new Notification, should response with 201 status code ', async () => {
               const notification = await request.post('/notif').send({
                "userID": 1,
                "itemID": 1,
                "commentID": 1,
                "bidID": 1,
                "ratingID": 1,
                "reportID": 1,
                "favoriteID": 1,
                "notiMessage": "New Comment on your item"
            });
            expect(notification.status).toBe(201);
        })
        it('test to delete notification, should response with 200 status code ', async () => {
            const delnotification = await request.delete(`/notif/${1}`);
         expect(delnotification.status).toBe(204);
     })
    
    })
    })
