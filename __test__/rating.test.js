"use strict";

const server = require("../server");
const supertest = require("supertest");
const db = require("../models");
const request = supertest(server.app);

const user1 = {
  userName: "userRating",
  fullName: "userRating",
  email: "userRating@test.com",
  password: "123",
  phoneNumber: "1",
  gender: "male",
  birthDate: "1994-10-26",
  image: "https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png",
  status: "active",
  role: "user",
};

const user2 = {...user1, userName: "userRating2", email: "userRating2@test.com, phoneNumber: 2"};
const user3 = {...user1, userName: "userRating3", email: "userRating3@test.com, phoneNumber: 3"};
const user4 = {...user1, userName: "userRating4", email: "userRating4@test.com, phoneNumber: 4"};

const user = {};
const ratedUser = {};
const user3test = {};
const user4test = {};

beforeAll(async () => {
  // await db.sequelize.sync({ force: true });
  user.data = await request.post("/signup").send(user1);
  ratedUser.data = await request.post("/signup").send(user2);
  user3test.data = await request.post("/signup").send(user3);
  user4test.data = await request.post("/signup").send(user4);
});

describe("Rating Test", () => {
  it("test to get all Ratings", async () => {
    const response = await request.get("/rating");
    expect(response.status).toBe(200);
  });

  it("test to create a new rating", async () => {
    const rating = await request.post("/rating").send({
      rating: 3,
      userId: user.data.body.id,
      ratedId: ratedUser.data.body.id,
    });
    expect(rating.status).toBe(201);
  });

  it("test to get one rating ", async () => {
    const response = await request.get(`/rating/${ratedUser.data.body.id}`);
    expect(response.status).toBe(200);
  });

  it("test to create a new rating for the same ratedUser", async () => {
    const rating = await request.post("/rating").send({
      rating: 5,
      userId: user3test.data.body.id,
      ratedId: ratedUser.data.body.id,
    });
    expect(rating.status).toBe(201);
  });

  it("test to update a rating", async () => {
    const rating = await request.put("/rating/1").send({
      rating: 4,
      userId: user.data.body.id,
      ratedId: ratedUser.data.body.id,
    });
    expect(rating.status).toBe(202);
  });

  it("test to get user rating", async () => {
    const rating = await request.get(`/userRating/${ratedUser.data.body.id}`);
    expect(rating.status).toBe(200);
  });

  // it("test to get error 400 when a user rates the same ratedUser twice", async () => {
  //   const rating = await request.post("/rating").send({
  //     rating: 3,
  //     userId: user.data.body.id,
  //     ratedId: ratedUser.data.body.id,
  //   });
  //   expect(rating.status).toBe(400);
  // });

  it("test to delete a rating", async () => {
    const newRating = await request.post("/rating").send({
      rating: 2,
      userId: user4test.data.body.id,
      ratedId: user3test.data.body.id,
    });

    const rating = await request.delete(`/rating/${newRating.body.id}`);
    expect(rating.status).toBe(204);
  });

  // test to get error 404 when rating path is not found
  it("test to get error 404 when rating path is not found", async () => {
    const rating = await request.get("/rating/1/1");
    expect(rating.status).toBe(404);
  });
});

describe("Rating Test2", () => {
  it("test to get error 400 when you try to rate yourself", async () => {
    const rating = await request.post("/rating").send({
      rating: 1,
      userId: user.data.body.id,
      ratedId: user.data.body.id,
    });
    expect(rating.status).toBe(400);
  });
});
