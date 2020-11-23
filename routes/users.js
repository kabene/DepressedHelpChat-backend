var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
//let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h



/* GET chat page : secure the route with JWT authorization */
router.get("/chat", function (req, res, next) {
  if (User.isUser(req.body.name)) return res.status(409).end();
  let newUser = new User(req.body.name);
  newUser.save().then(() => {
    jwt.sign(
      { username: newUser.username },
      jwtSecret,
      { expiresIn: LIFETIME_JWT },
      (err, token) => {
        if (err) {
          console.error("GET /chat :", err);
          return res.status(500).send(err.message);
        }
        console.log("GET /user token:", token);
        return res.json({ username: newUser.username, token });
      }
    );
  });
});

module.exports = router;
