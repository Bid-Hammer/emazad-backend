"use strict";

const server = require('../server');
const supertest = require('supertest');
const request = supertest(server.app);

const FormData = require('form-data');
const fs = require('fs');
describe('User Test', () => {
describe('Verify User get routs', () => {
    it('test to get all users, should response with 201 status code ', async () => {
        const response = await request.get('/users/needToken');
        expect(response.status).toBe(404);
    });
    it('test to get one user, should response with 200 status code ', async () => {
        const response = await request.get(`/users/${1}`);
        expect(response.status).toBe(404);
    });
});
describe('Verify User post routs', () => {
    it('test to create a new user, should response with 201 status code ', async () => {          
const form = new FormData();
form.append('userName', 'omar');
form.append('fullName', 'omar');
form.append('email', ' omar@gmail.com');
form.append('password', '1234');
form.append('phoneNumber', 123);
form.append('gender' , 'male');
form.append('birthDate', '1/1/1999');
form.append('image-file', fs.createReadStream('./test.jpg'));
const register = await request.post('/signup').send(form);
expect(register.status).toBe(201);

    })
//     it('test to login the user, should response with 200 status code ', async () => {
//         const login = await request.post('/login').send({   
//          "email": "omar@gmail.com",
//          "password": "1234",
//      });
//      expect(login.status).toBe(200);
//  })

})
})
