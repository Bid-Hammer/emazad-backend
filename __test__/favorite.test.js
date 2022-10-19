"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Favorite Test', () => {
  describe('Favorite Test get Favorites', () => {
      it('test to get all Favorites, should response with 200 status code ', async () => {
          const response = await request.get('/favorite');
          expect(response.status).toBe(200);
      });
      it('test to get all FavoritesList, should response with 200 status code ', async () => {
        const response = await request.get('/favoritelist');
        expect(response.status).toBe(200);
    });
      it('test to get one favorite, should response with 200 status code ', async () => {
          const response = await request.get(`/favorite/${1}`);
          expect(response.status).toBe(200);
      });
  });
  describe('Verify favorite post routs', () => {
      it('test to create a new favorite, should response with 201 status code ', async () => {
             const favorite = await request.post('/favorite').send({
              "userID": 1,
              "itemID": 1
          });
          expect(favorite.status).toBe(201);
      })
      it('test to login the user, should response with 200 status code ', async () => {
          const delFavorite = await request.delete(`/favorite/${1}`);
       expect(delFavorite.status).toBe(204);
   })
  
  })
  })
