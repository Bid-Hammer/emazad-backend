"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Favorite Test', () => {
  describe('Favorite Test get Favorites', () => {
      it('test to get all Favorites', async () => {
          const response = await request.get('/favorite');
          expect(response.status).toBe(200);
      });
      it('test to get all FavoritesList ', async () => {
        const response = await request.get('/favoritelist');
        expect(response.status).toBe(200);
    });
    
  });
  describe('Verify favorite post routs', () => {
      it('test to create a new favorite ', async () => {
             const favorite = await request.post('/favorite').send({
              "userID": 1,
              "itemID": 1
          });
          expect(favorite.status).toBe(200);
      })

  })
  })
