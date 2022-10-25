"use strict";

const server = require("../server");
const supertest = require("supertest");
const request = supertest(server.app);

describe("Comment Test", () => {
  const users = {};
  const items = {};
  const comments = {};

  beforeAll(async () => {
    // create a user before all tests and get the token from it
    const user1 = {
      userName: "userReply1",
      fullName: "userReply1",
      email: "userReply1@test.com",
      password: "123",
      phoneNumber: "323212",
      gender: "male",
      birthDate: "1994-10-26",
      image: "https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png",
      status: "active",
      role: "user",
    };

    const user2 = { ...user1, userName: "userReply2", email: "userReply2@test.com", phoneNumber: "12123232" };

    const response = await request.post("/signup").send(user1);
    const response2 = await request.post("/signup").send(user2);
    users.user1 = response.body;
    users.user2 = response2.body;

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

    const item2 = { ...item1, itemCondition: "Used" };

    const itemOne = await request.post("/item").send(item1);
    const itemTwo = await request.post("/item").send(item2);
    items.item1 = itemOne.body;
    items.item2 = itemTwo.body;

    const comment1 = {
        userId: users.user1.id,
        itemId: items.item1.id,
        comment: "test comment 1",
    };

    const commentResponse = await request.post("/comment").send(comment1);
    comments.comment1 = commentResponse.body;

  });

    it("should create a new reply", async () => {
        const reply1 = {
            userId: users.user1.id,
            commentId: comments.comment1.id,
            reply: "test reply 1",
        };

        const response = await request.post("/reply").send(reply1);
        expect(response.status).toEqual(201);
    });

    it("should get all replies", async () => {
        const response = await request.get("/reply");
        expect(response.status).toEqual(200);
    });

    it("should update a reply", async () => {
        const reply1 = {
            userId: users.user1.id,
            commentId: comments.comment1.id,
            reply: "updated reply",
        };

        const response = await request.put("/reply/1").send(reply1);
        expect(response.status).toEqual(202);
    });

    it("should delete a reply", async () => {
        const response = await request.delete("/reply/1");
        expect(response.status).toEqual(204);
    });
    
});