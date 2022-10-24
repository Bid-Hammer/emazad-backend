"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Rating Test', () => {
    describe('Rating Test to get the Ratings', () => {
        it('test to see if we can get the ratings', async () => {
            const response = await request.get('/rating');
            expect(response.status).toBe(201);
        });
        
    });
    describe('testing the rating routs', () => {
        it('test to create a new rating', async () => {
               const rating = await request.post('/rating').send({
                "rating": 1,
                "userID": 1,
                "ratedID": 1
            });
            expect(rating.status).toBe(201);
        })
    })
    })
  
