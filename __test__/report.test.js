"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('Report Test', () => {
    it( 'should create a new report', async () => {
        const response = await request.post('/report').send({
            "reportTitle": "Report",
            "reportMessage": "This is a report",
            "reportReason": "For Testing",
            "userID": 1,
            "itemID": 1
        });

        expect(response.status).toBe(200);
        expect(response.body.reportTitle).toEqual("Report");
        expect(response.body.userID).toEqual(1);
        expect(response.body.itemID).toEqual(1);
    }
    );
});
