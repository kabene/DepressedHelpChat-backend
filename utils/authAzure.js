"use strict";

/***************************************************************************************
 *    Title: Démarrage rapide : Utiliser la bibliothèque de client Analyse de texte
 *    Author: Microsoft Cognitive-services
 *    Availability: https://docs.microsoft.com/fr-fr/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?tabs=version-3-1&pivots=programming-language-javascript
 ***************************************************************************************/


const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '';
const endpoint = 'https://depressedhelpedchat.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

module.exports = {textAnalyticsClient};
