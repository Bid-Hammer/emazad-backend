'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user.routes');
app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Home Page')
})

function start(port) {
    app.listen(port, () => console.log(`Server is starting on port ${port}`))
}

module.exports = {
    app,
    start
}