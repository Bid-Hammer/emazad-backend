"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Server Test', () => {
    it('Home page test', async () => {
        const response = await request.get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual('Home Page');
    });

    it('Server should respond with 404 on an invalid route', async () => {
        const response = await request.get('/nosuchroute');
        expect(response.status).toBe(404);
    });

});
