"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);


describe('Rating Test', () => {
    describe('Rating Test get Ratings', () => {
        it('test to get all Ratings', async () => {
            const response = await request.get('/rating');
            expect(response.status).toBe(200);
        });
        
        it('test to get one rating ', async () => {
            const response = await request.get(`/rating/${1}`);
            expect(response.status).toBe(200);
        });
    });
    describe('Verify rating post routs', () => {
        it('test to create a new rating', async () => {
               const rating = await request.post('/rating').send({
                "rating": 1,
                "userID": 1,
                "ratedID": 1
            });
            expect(rating.status).toBe(201);
        })
        it('test to login the user ', async () => {
            const delrating = await request.delete(`/rating/${1}`);
         expect(delrating.status).toBe(204);
     })
    
    })
    })
  
