var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
//let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h


router.post("/handleUserMessage", function(req, res, next){
  console.log(req.body.message);
  return res.json({ answer: "TEST" });
});

/* POST chat page : secure the route with JWT authorization */
router.post("/chat", function (req, res, next) {
  //if (User.isUser(req.body.username)) return res.status(409).end();
  console.log("req.body.username "+req.body.username);
  let newUser = new User(userHash(req.body.username));
  console.log("newUser : "+newUser.username);
  newUser.save().then(() => {
    jwt.sign(
      { username: newUser.username },
      jwtSecret,
      { expiresIn: LIFETIME_JWT },
      (err, token) => {
        if (err) {
          console.error("POST /chat :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST /user token:", token);
        return res.json({ username: newUser.username, token });
      }
    );
  });
});

function userHash(userName) {               
  var hash = 0; 
  if (userName.length == 0) return hash; 
  for (i = 0; i < userName.length; i++) { 
      char = userName.charCodeAt(i); 
      hash = ((hash << 5) - hash) + char; 
      hash = hash & hash; 
  } 
    
  return hash; 
}

module.exports = router;
