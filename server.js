'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user.routes');
const itemRoutes = require('./routes/item.routes');
const bidRoutes = require('./routes/bid.routes');
const commentRoutes = require('./routes/comment.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const notificationRoutes = require('./routes/notification.routes');
const ratingRoutes = require('./routes/rating.routes');
const reportRoutes = require('./routes/report.routes');


app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(itemRoutes);
app.use(commentRoutes);
app.use(bidRoutes);
app.use(favoriteRoutes);
app.use(notificationRoutes);
app.use(ratingRoutes);
app.use(reportRoutes);



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