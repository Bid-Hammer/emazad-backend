"use strict";
const server = require("../server");
const supertest = require("supertest");
const request = supertest(server.app);
const db = require("../models");
require("dotenv").config();

describe("Bid & Notification Tests", () => {
  const users = {};
  const items = {};

  // create a user before all tests and get the id from it and add it to the created item
  beforeAll(async () => {
    const userBid1 = {
      userName: "userBid1",
      fullName: "userBid1",
      email: "userBid1@test.com",
      password: "123",
      phoneNumber: "1",
      gender: "male",
      birthDate: "1994-10-26",
      image: "https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png",
      status: "active",
      role: "user",
    };

    const userBid2 = { ...userBid1, userName: "userBid2", email: "userBid2@test.com", phoneNumber: "11" };

    const response = await request.post("/signup").send(userBid1);
    const response2 = await request.post("/signup").send(userBid2);
    users.user1 = response.body;
    users.user2 = response2.body;

    const item1 = {
      itemTitle: "itemBid1",
      itemDescription: "itemBid1",
      itemImage: ["https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png"],
      category: "clothes",
      userId: users.user1.id,
      latestBid: "5",
      initialPrice: "10",
      startDate: "2021-10-26T00:00:00.000Z",
      endDate: "2025-10-26T00:00:00.000Z",
      status: "active",
      subCategory: "shoes",
      itemCondition: "New",
    };

    const item3 = { ...item1, status: "sold" };
    const item4 = { ...item1, status: "standby" };
    const item5 = { ...item1, status: "expired" };

    const item = await request.post("/item").send(item1);
    const item2 = await request.post("/item").send(item1);
    const itemSold = await request.post("/item").send(item3);
    const itemStandby = await request.post("/item").send(item4);
    const itemExpired = await request.post("/item").send(item5);
    items.item1 = item.body;
    items.item2 = item2.body;
    items.itemSold = itemSold.body;
    items.itemStandby = itemStandby.body;
    items.itemExpired = itemExpired.body;
  });

  // crate a new bid for bid lower than or equal the initial price
  it("crate a new bid for bid lower than or equal the initial price", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.item2.id,
        bidprice: 9,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("first bid should be higher than the initial price");
  });

  // bid for your item
  it("bid for your item", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user1.id,
        itemId: items.item2.id,
        bidPrice: 10,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("You can not bid on your own item");
  });

  // bid higher than the initial price
  it("bid higher than the latest bid and initial price", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.item2.id,
        bidprice: 40,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(201);
  });

  // bid lower than the latest bid
  it("bid lower than the latest bid", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.item2.id,
        bidprice: 20,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Your bid price is lower than the latest bid");
  });

  // bid for sold item
  it("bid for sold item", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.itemSold.id,
        bidprice: 90,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("This item is already sold");
  });
  // bid for item expired
  it("bid for item expired", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.itemExpired.id,
        bidprice: 90,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("This item is already sold");
  });

  // bid for standby item
  it("bid for standby item", async () => {
    const response = await request
      .post("/bid")
      .send({
        userId: users.user2.id,
        itemId: items.itemStandby.id,
        bidprice: 90,
      })
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("The auction for this item has not started yet");
  });

  // git all bids for item
  it("git all bids for item", async () => {
    const response = await request.get(`/bid/${items.item2.id}`).set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(200);
  });

  // git one bid by id
  it("git one bid by id", async () => {
    const response = await request.get(`/bid/${items.item1.id}`).set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(200);
  });

  // get nofication for user
  it("get nofication for user", async () => {
    const response = await request
      .get(`/usernotif/${users.user1.id}`)
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(200);
  });

  // ERROR 500 get nofication for user for id dosent exist
  it(" error get nofication for user", async () => {
    const response = await request.get("/usernotif/5.5").set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(500);
  });

  // get all nofication
  it("get all nofication", async () => {
    const response = await request.get("/notif").set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(200);
  });

  // ERROR 500 update nofication
  it("update nofication", async () => {
    const response = await request.put("/notif/5.5");
    // .set('Authorization', `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(500);
  });

  // delete nofication
  it("delete nofication", async () => {
    const response = await request
      .delete(`/notif/${users.user1.id}`)
      .set("Authorization", `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(204);
  });

  // create nofication
  let notifId;
  it("create nofication", async () => {
    const response = await request.post("/notif").send({
      userId: users.user1.id,
      itemId: items.item1.id,
      notiMessage: "bla bla",
      status: "unread",
    });
    notifId = response.body.id;
    expect(response.status).toEqual(201);
  });

  // update nofication
  it("update nofication to read", async () => {
    const response = await request.put(`/notif/${notifId}`)
    // .set('Authorization', `Bearer ${users.user1.token}`);
    expect(response.status).toEqual(202);
  });
});
