var express = require("express");
var {textAnalyticsClient} = require("../utils/authAzure.js")
var router = express.Router();
var User = require("../models/User.js");
//let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h

var i;


router.post("/handleUserMessage", async function (req, res, next) {
    //répondre sans avoir reçu de request  pour intier la conversation  ? :)
    console.log(req.body.message);
    try {
        await sentimentAnalysis(textAnalyticsClient, req.body.message, res);
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }

});

/* POST chat page : secure the route with JWT authorization */
router.post("/chat", function (req, res, next) {
    //if (User.isUser(req.body.username)) return res.status(409).end();this.username=req.body.username;
    console.log("req.body.username " + req.body.username);
    let newUser = new User(userHash(req.body.username));
    console.log("newUser : " + newUser.username);
    newUser.save().then(() => {
        jwt.sign(
            {username: newUser.username},
            jwtSecret,
            {expiresIn: LIFETIME_JWT},
            (err, token) => {
                if (err) {
                    console.error("POST /chat :", err);
                    return res.status(500).send(err.message);
                }
                console.log("POST /user token:", token);
                return res.json({username: newUser.username, token});
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


async function sentimentAnalysis(client, textInput, res) {

    const sentimentInput = [textInput];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);


    sentimentResult.forEach(document => {
        let score_positive_general = document.confidenceScores.positive.toFixed(2);
        let score_neutral_general = document.confidenceScores.neutral.toFixed(2);
        let score_negative_general = document.confidenceScores.negative.toFixed(2);
        console.log(score_positive_general, score_neutral_general, score_negative_general);
        if (score_neutral_general >= score_positive_general && score_neutral_general >= score_negative_general) {
            res.json({answer: `Désolé mais je n'arrive pas très bien à saisir ta situation, pourrais-tu m'en dire plus ? `});
        } else {
            if (/*score_negative_general>score_positive_general && score_negative_general>score_neutral_general*/ score_negative_general == 1) {


            } else if (score_negative_general < 1 && score_negative_general >= 0.75) {
                if (textInput.includes("suicide" || "suicider" || "me donner la mort" || " en finir avec la vie")) {
                    answeres = ["Tu n'as pas besoin d'en arriver la, si ça ne va vraiment pas tu pourrais passer un appel à un service d'aide mais il faudrait que tu demandes me le demande"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});

                } else if (score_positive_general > 0.12) {
                    answeres = ["il faudrait te changer les idées... regarde un film: je te conseil : le retour de la momie"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                } else {
                    answeres = ["Tu sais que tu n'es pas seul, on est énormément sur terre dans cette situation"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                }

            } else if (score_negative_general < 0.75 && score_negative_general >= 0.5) {
                if (textInput.includes("suicide"||"suicider"||"me donner la mort"||" en finir avec la vie")){
                    answeres=["Tu n'as pas besoin d'en arriver la, si ça ne va vraiment pas tu pourrais passer un appel à un service d'aide mais il faudrait que tu demandes me le demande"];
                    i=Math.floor(Math.random() * answeres.length) ;
                    res.json({answer: answeres[i]});


                }else if (score_positive_general > 0.32) {
                    answeres = ["De temps en temps  il faut prendre la vie d'un point de vue plus philosophe", "Tu aimerais que l'on parles d'autre chose ?"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                } else {
                    answeres = ["Si jamais tu pourrais te trouver à manger askip la nourriture règle tout les soucis "];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                }
            } else if (score_negative_general < 0.5 && score_negative_general >= 0.25) {
                if (textInput.includes("suicide" || "suicider" || "me donner la mort" || " en finir avec la vie")) {
                    answeres = ["Tu n'as pas besoin d'en arriver la, si ça ne va vraiment pas tu pourrais passer un appel à un service d'aide mais il faudrait que tu demandes me le demande"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                } else if (score_positive_general >= 0.75) {
                    answeres = ["c'est plutot banal, il parrait que la météo influance grandement les émotions"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                } else {
                    answeres = ["tu as passé une mauvaise journée , ça arrive essaye de te vider l'esprit mais si tu veux on peut en parler"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});
                }

            } else if (score_negative_general < 0.25 && score_negative_general >= 0) {
                if (score_positive_general < 0.85) {
                    answeres = ["Tu vas plutot bien selon mes observations! personellement je profite oklm du temps qu'il me reste avant mes examens"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});

                } else {
                    answeres = ["Mais t'es en pleine forme!  par contre je détecte une pointe de sarcasme ou alors essaye tu de me dissimuler quelques chose? Voilà une petite blague pour détendre l'atmosphère : C’est un panda qui en avait marre de la vie et un jour, il se panda…"];
                    i = Math.floor(Math.random() * answeres.length);
                    res.json({answer: answeres[i]});

                }
            } else {
                res.json({answer: `Désolé  mais je n'arrive pas très bien à saisir ta situation, pourrais-tu m'en dire plus ? `});
            }
        }
    });
}


module.exports = router;
