"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe("Favorite Test", () => {
    const users = {};
    const items = {};
  
    beforeAll(async () => {
      // create a user before all tests and get the token from it
      const user1 = {
        userName: "userFavorite1",
        fullName: "userFavorite1",
        email: "userFavorite1@test.com",
        password: "123",
        phoneNumber: "422442244",
        gender: "male",
        birthDate: "1994-10-26",
        image: "https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png",
        status: "active",
        role: "user",
      };
  
      const response = await request.post("/signup").send(user1);
      users.user1 = response.body;
  
      const item1 = {
        itemTitle: "item1",
        itemDescription: "item1",
        itemImage: ["https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png"],
        category: "clothes",
        userId: users.user1.id,
        latestBid: 5,
        initialPrice: 10,
        startDate: "2021-10-26T00:00:00.000Z",
        endDate: "2025-10-26T00:00:00.000Z",
        status: "active",
        subCategory: "shoes",
        itemCondition: "New",
      };
  
      const itemFav = await request.post("/item").send(item1);
      items.item1 = itemFav.body;
    });

    it("should create a new favorite", async () => {

        const favorite = {
            userId: users.user1.id,
            itemId: items.item1.id,
        };
        const response = await request.post("/favorite").send(favorite);
        expect(response.status).toBe(201);
    });

    it("should get all favorites", async () => {
        const response = await request.get("/favorite");
        expect(response.status).toBe(200);
    });

    it("should get a favorite by id", async () => {
        const response = await request.get(`/favorite/${users.user1.id}`);
        expect(response.status).toBe(200);
    });

    it("should get user favorite list by user id", async () => {
        const response = await request.get(`/userFavorite/${users.user1.id}`);
        expect(response.status).toBe(200);
    });

    it("should not add a favorite if it already exists", async () => {
        const favorite = {
            userId: users.user1.id,
            itemId: items.item1.id,
        };
        const response = await request.post("/favorite").send(favorite);
        expect(response.status).toBe(400);
    });

    it("should delete a favorite", async () => {
        const response = await request.delete('/favorite/1');
        expect(response.status).toBe(204);
    });


});
