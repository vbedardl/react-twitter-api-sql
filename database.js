const db = require("./server");

const getTweetLists = function () {
  return db
    .query(
      `
      SELECT content as text, creation_date, name, email as handle, profile_image, tweets.id, creation_date, COUNT(likes.user_id) as likes  
      FROM tweets
      JOIN users ON users.id = owner_id
      LEFT JOIN likes ON tweet_id = tweets.id
      GROUP BY tweets.content, tweets.creation_date, users.name, users.email, users.profile_image, tweets.id
      ORDER BY tweets.id;
    `
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getTweetLists = getTweetLists;

const addTweet = function (body) {
  const { owner_id, content } = body;
  return db
    .query(
      `
    INSERT INTO tweets (owner_id, content)
    VALUES ($1, $2)
    RETURNING *
  `,
      [owner_id, content]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.addTweet = addTweet;

const createUser = function (userObject) {
  const { name, email, password } = userObject;
  return db
    .query(
      `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
      [name, email, password]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.createUser = createUser;

const getUserWithEmail = function (email) {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE email = $1
 `,
      [email]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function (id) {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE id = $1
 `,
      [id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getUserWithId = getUserWithId;

const createComment = function (data) {
  const { owner_id, tweet_id, content } = data;
  return db
    .query(
      `
    INSERT INTO comments (owner_id, tweet_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
      [owner_id, tweet_id, content]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.createComment = createComment;

const getCommentLists = function () {
  return db
    .query(
      `
    SELECT comments.*, name, profile_image FROM comments
    JOIN users ON owner_id = users.id
  `
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getCommentLists = getCommentLists;

const likeTweet = function (tweet_id, user_id) {
  return db
    .query(
      `
    INSERT INTO likes (tweet_id, user_id)
    VALUES ($1, $2)
    RETURNING *
  `,
      [tweet_id, user_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.likeTweet = likeTweet;

const dislikeTweet = function (tweet_id, user_id) {
  return db
    .query(
      `
    DELETE FROM likes 
    WHERE tweet_id = $1 AND user_id = $2
  `,
      [tweet_id, user_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.dislikeTweet = dislikeTweet;

const followUser = function (followed_id, follower_id) {
  return db
    .query(
      `
  INSERT INTO followings (followed_id, follower_id)
  VALUES ($1, $2)
  RETURNING *`,
      [followed_id, follower_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.followUser = followUser;

const unFollowUser = function (followed_id, follower_id) {
  return db
    .query(
      `
    DELETE FROM followings 
    WHERE followed_id = $1 AND follower_id = $2
  `,
      [followed_id, follower_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.unFollowUser - unFollowUser;

const getLikesFromUser = function (user_id) {
  return db
    .query(
      `
    SELECT * FROM likes
    WHERE user_id = $1
  `,
      [user_id]
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getLikesFromUser = getLikesFromUser;
