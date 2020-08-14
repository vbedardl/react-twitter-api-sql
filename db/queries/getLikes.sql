-- SELECT *, user_id FROM tweets
-- JOIN likes ON tweets.id = tweet_id;


      SELECT content as text, creation_date, name, email as handle, profile_image, tweets.id, creation_date, COUNT(likes.user_id) as likes  
      FROM tweets
      JOIN users ON users.id = owner_id
      LEFT JOIN likes ON tweet_id = tweets.id
      GROUP BY tweets.content, tweets.creation_date, users.name, users.email, users.profile_image, tweets.id
      ORDER BY tweets.id;


          SELECT content as text, creation_date, name, email as handle, profile_image, tweets.id, creation_date  FROM tweets
    JOIN users ON users.id = owner_id;