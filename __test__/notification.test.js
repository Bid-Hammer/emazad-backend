"use strict";

const server = require("../server");
const supertest = require("supertest");
const request = supertest(server.app);

describe("Notification Tests", () => {
  it("should get all notifications", async () => {
    const response = await request.get("/notif");
    expect(response.status).toBe(200);
  });

  it("should get one notification by id", async () => {
    const response = await request.get("/notif/1");
    expect(response.status).toBe(200);
  });

  it("should get all notifications for one user", async () => {
    const response = await request.get("/usernotif/1");
    expect(response.status).toBe(200);
  });

  it("should get all notifications for one user", async () => {
    const response = await request.get("/usernotif/1");
    expect(response.status).toBe(200);
  });

  it("should create a notification", async () => {
    const response = await request.post("/notif").send({
      userId: 1,
      itemId: 1,
      commentId: 1,
      replyId: 1,
      bidId: 1,
      ratingId: 1,
      reportId: 1,
      notiMessage: "test",
      status: "read",
    });
    expect(response.status).toBe(201);
  });

  it("should delete a notification by id", async () => {
    const response = await request.delete("/notif/1");
    expect(response.status).toBe(204);
  });
});
