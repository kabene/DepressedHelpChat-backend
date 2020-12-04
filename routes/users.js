var express = require("express");
var {textAnalyticsClient}= require("../utils/authAzure.js")
var router = express.Router();
var User = require("../models/User.js");
//let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h


router.post("/handleUserMessage", async  function(req, res, next) {
    //répondre sans avoir reçu de request  pour intier la conversation  ? :)
  console.log(req.body.message);
  try {
      await sentimentAnalysis(textAnalyticsClient, req.body.message);
      res.json({ answer: "TEST" });
  }catch (error){
      console.log(error);
      res.status(500).end();
  }

});

/* POST chat page : secure the route with JWT authorization */
router.post("/chat", function (req, res, next) {
  //if (User.isUser(req.body.username)) return res.status(409).end();
  console.log("req.body.username "+req.body.username);
  let newUser = new User(req.body.username);
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

    const sentimentInput = [textInput];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);


    sentimentResult.forEach(document => {
        let score_positive_general= document.confidenceScores.positive.toFixed(2);
        let score_neutral_general= document.confidenceScores.neutral.toFixed(2);
        let score_negative_general= document.confidenceScores.negative.toFixed(2);
        if (1== score_neutral_general){

        }else {

            if (1 == score_negative_general) {
                var keyword = keyPhraseExtraction(sentimentInput);
                if (keyword.includes("suicide")) {

                } else {

                }
                if (score_positive_general == 1) {
                } else if (score_positive_general < 1 && score_positive_general >= 0.75) {
                } else if (score_positive_general < 0.75 && score_positive_general >= 0.50) {
                } else if (score_positive_general < 0.5 && score_positive_general >= 0.25) {
                } else if (score_positive_general < 0.25 && score_positive_general >= 0.0) {

                }

            } else if (score_negative_general < 1 && score_negative_general >= 0.75) {

                if (score_positive_general == 1) {
                } else if (score_positive_general < 1 && score_positive_general >= 0.75) {
                } else if (score_positive_general < 0.75 && score_positive_general >= 0.50) {
                } else if (score_positive_general < 0.5 && score_positive_general >= 0.25) {
                } else if (score_positive_general < 0.25 && score_positive_general >= 0.01) {

                }

            } else if (score_negative_general < 0.75 && score_negative_general >= 0.5) {

                if (score_positive_general == 1) {
                } else if (score_positive_general < 1 && score_positive_general >= 0.75) {
                } else if (score_positive_general < 0.75 && score_positive_general >= 0.50) {
                } else if (score_positive_general < 0.5 && score_positive_general >= 0.25) {
                } else if (score_positive_general < 0.25 && score_positive_general >= 0.0) {

                }

            } else if (score_negative_general < 0.5 && score_negative_general >= 0.25) {

                if (score_positive_general == 1) {
                } else if (score_positive_general < 1 && score_positive_general >= 0.75) {
                } else if (score_positive_general < 0.75 && score_positive_general >= 0.50) {
                } else if (score_positive_general < 0.5 && score_positive_general >= 0.25) {
                } else if (score_positive_general < 0.25 && score_positive_general >= 0.0) {

                }

            } else if (score_negative_general < 0.25 && score_negative_general >= 0) {

                if (score_positive_general == 1) {
                    res.json({answer: "Vous allez plutot bien selon mes observations! personellement je profite oklm du temps qu'il me reste avant mes examens "});
                } else if (score_positive_general < 1 && score_positive_general >= 0.75) {
                } else if (score_positive_general < 0.75 && score_positive_general >= 0.50) {
                } else if (score_positive_general < 0.5 && score_positive_general >= 0.25) {
                } else if (score_positive_general < 0.25 && score_positive_general >= 0.0) {

                }


            }
        }
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

async function keyPhraseExtraction(client ,textInput){
    const keyPhraseResult = await client.extractKeyPhrases(textInput);
    keyPhraseResult.forEach(docu => {
        console.log(`\tDocument Key Phrases: ${docu.keyPhrases}`);
        return document.keyPhrases;
    });

}



module.exports = router;
