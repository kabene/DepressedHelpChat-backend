var createError = require("http-errors");
var helmet=require("helmet");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

let { authorize } = require("./utils/auth");

var app = express();
app.use(helmet);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// all the routes given in the filmRouter shall be secure : call the authorize middleware



module.exports = app;
