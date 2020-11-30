"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '4a56b4f67a574fa8980ca95b8d174f35';
const endpoint = 'https://depressedhelpedchat.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

module.exports = {textAnalyticsClient};