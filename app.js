var createError = require("http-errors");
var helmet=require("helmet");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//var session = require("express-session");

var usersRouter = require("./routes/users");

var app = express();
app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// not found in static files, so default to index.html
app.use((req, res,next) => {  
  if (!req.path.startsWith("/api/"))
    return res.sendFile(`${__dirname}/public/index.html`);  
  next();
});

//app.use("/", indexRouter);
app.use("/api/users", usersRouter);

module.exports = app;