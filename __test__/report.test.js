"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);


describe('Report', () => {
    it('should create a report', async () => {
        const response = await request.post('/report').send({
        reportTitle: "report title",
        reportMessage: "report message",
        reportReason: 'Spam',
        userId: 1,
        itemId: 1
        });
        expect(response.status).toBe(201);
    });
});

describe('Report', () => {
    it('should get all reports', async () => {
        const response = await request.get('/report');
        expect(response.status).toBe(200);
    });
}
);

describe('Report', () => {
    it('should get one report by id', async () => {
        const response = await request.get('/report/1');
        expect(response.status).toBe(200);
    });
}
);

describe('Report', () => {
    it('should delete a report by id', async () => {
        const response = await request.delete('/report/1');
        expect(response.status).toBe(204);
    });
}
);
