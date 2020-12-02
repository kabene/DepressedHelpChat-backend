var express = require("express");
var {textAnalyticsClient}= require("../utils/authAzure.js")
var router = express.Router();
var User = require("../models/User.js");
var local_username;
//let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h


router.post("/handleUserMessage", async  function(req, res, next) {
    //répondre sans avoir reçu de request  pour intier la conversation  ? :)
    res.json({ answer: "Bonjour"+local_username });
    res.json({ answer: "Comment vas-tu aujourd'hui?"});
  console.log(req.body.message);
  try {
      await sentimentAnalysis(textAnalyticsClient, req.body.message);
      res.json({ answer: "TEST" });
  }catch (error){
      console.log(error);
      res.status(500).end();
  }

    /* traitement messages ici
    * 2 choix possibles :
    * 1)  => min 100 réponses possibles classé en fct de l'état des réponses
    * 2)  => utilisation QrA  et entré les questions possbile puis leurs attribué une réponse ensuite entrainer le modèle
    * pour obtenir des réponses plus "humaines" et plus adaptée à l'utilisateur.
    *
    *
    * */
});

/* POST chat page : secure the route with JWT authorization */
router.post("/chat", function (req, res, next) {
  //if (User.isUser(req.body.username)) return res.status(409).end();
    local_username=req.body.username
  console.log("req.body.username "+local_username);
  let newUser = new User(local_username);
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


async function sentimentAnalysis(client , textInput){

    const sentimentInput = [
        textInput
    ];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);
    const keyPhraseResult = await client.extractKeyPhrases(sentimentInput);

    sentimentResult.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Sentiment: ${document.sentiment}`);
        console.log(`\tDocument Scores:`);
        console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
        console.log(`\tSentences Sentiment(${document.sentences.length}):`);
        document.sentences.forEach(sentence => {
            console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
            console.log(`\t\tSentences Scores:`);
            console.log(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}`);
        });
    });
}


module.exports = router;
