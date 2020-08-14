// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 5001;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const app = express();

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

const database = require("./database");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 60 * 60 * 1000 * 1,
  })
);

//Helpers
const isLoggedIn = (req, res, next) => {
  return database
    .getUserWithId(req.session.userId)
    .then((user) => next())
    .catch((e) => res.send({}));
};

const login = (email, password) => {
  return database.getUserWithEmail(email).then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

//Get all the tweets
app.get("/api/tweets", (req, res) => {
  database.getTweetLists().then((data) => {
    res.send({ data: data });
  });
});

//Create new tweet
app.post("/api/tweets", isLoggedIn, (req, res) => {
  database
    .addTweet(req.body)
    .then((data) => {
      res.send({});
    })
    .catch((e) => null);
});

app.get("/api/comments", (req, res) => {
  database
    .getCommentLists()
    .then((data) => res.send({ data: data }))
    .catch((e) => null);
});

//Add Comment to a tweet
app.post("/api/comments", isLoggedIn, (req, res) => {
  database
    .createComment(req.body)
    .then((data) => res.send(data))
    .catch((e) => null);
});

//Create new user
app.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);
  database.getUserWithEmail(user.email).then((existingUser) => {
    if (existingUser) {
      res.send();
    } else {
      database
        .createUser(req.body)
        .then((data) => {
          req.session.userId = data.id;
          console.log("in server:", data);
          res.send({ data });
        })
        .catch((e) => res.send());
    }
  });
});

app.get("/api/like", (req, res) => {
  database.getLikesFromUser().then((data) => res.send({ data: data }));
});

//Like a tweet
app.post("/api/like", isLoggedIn, (req, res) => {
  console.log("server", req.session.userId);
  database
    .likeTweet(req.body.tweet_id, req.session.userId)
    .then((data) => res.send({ data: data }))
    .catch((e) => null);
});

//Dislike a tweet
app.delete("/api/like/:id", isLoggedIn, (req, res) => {
  database
    .dislikeTweet(req.params.id, req.session.userId)
    .then((data) => res.send({ data: data }))
    .catch((e) => null);
});

//Follow a user
app.post("/api/follow/:id", isLoggedIn, (req, res) => {
  database
    .followUser(req.params.id, req.session.userId)
    .then((data) => res.send({ data: data }))
    .catch((e) => null);
});

//Unfollow a user
app.delete("/api/follow/:id", isLoggedIn, (req, res) => {
  database
    .unFollowUser(req.params.id, req.session.userId)
    .then((data) => res.send({ data: data }))
    .catch((e) => null);
});

//Login a user
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  login(email, password)
    .then((user) => {
      req.session.userId = user.id;
      res.send({ user });
    })
    .catch((e) => res.send());
});

//Logout user
app.post("/api/logout", (req, res) => {
  req.session.userId = null;
  res.send({});
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
