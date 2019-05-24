const express = require('express'),
    apiCall = require('./database/database_setup.js'),
    token = require('./utls/token_utils.js'),
    passport = require('passport'),
    LocalStrategry = require('passport-local'),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./model/user.js"),
    Post = require('./model/post.js'),
    Comment = require("./model/comment"),
    app = express();

const commentRoutes = require('./routes/comments'),
      postRoutes = require('./routes/posts'),
      authRoutes = require('./routes/index');

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// Setup Express Sessions
app.use(require("express-session")({
    secret: "2QepxniwWin98fujitsu",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategry(User.authenticate())) // auhtenticate() commes with local-mongoose
passport.serializeUser(User.serializeUser());  // serialize and deserialize come with local-mongoose
passport.deserializeUser(User.deserializeUser());







function getTimeStamp() {
    var currentDate = new Date();
    return currentDate;
};


app.listen(7000, () => {
    console.log("Reddit Server Started");
});

app.listen();