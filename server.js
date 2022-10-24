"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user.routes");
const handleNotFound = require("./error-handlers/404");
const handleServerError = require("./error-handlers/500");
const itemRoutes = require("./routes/item.routes");
const bidRoutes = require("./routes/bid.routes");
const commentRoutes = require("./routes/comment.routes");
const replyRoutes = require("./routes/reply.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const notificationRoutes = require("./routes/notification.routes");
const ratingRoutes = require("./routes/rating.routes");
const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");


app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(itemRoutes);
app.use(commentRoutes);
app.use(replyRoutes);
app.use(bidRoutes);
app.use(favoriteRoutes);
app.use(notificationRoutes);
app.use(ratingRoutes);
app.use(reportRoutes);
app.use(chatRoutes);
app.use(express.static('ImageItems'));
app.use(express.static('ImageUsers'));


app.get("/", (req, res) => {
  res.status(200).send("Home Page");
});

function start(port) {
  app.listen(port, () => console.log(`Server is starting on port ${port}`));
}

app.use(handleServerError);
app.use(handleNotFound);

module.exports = {
  app,
  start,
};
