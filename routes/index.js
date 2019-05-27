const express = require('express'),
      passport = require('passport'),
      router = express.Router(),
      User = require('../model/user'),
      path = require('path'),
      appDir = path.dirname(require.main.filename),
      getTimeStamp = require('../utls/time_utils');

router.get("/", (req, res) => {
    console.log(req.user);
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    res.sendFile('./public/static_index.html', { root: appDir });
});

//show register
router.get("/register", (req, res) => {
    console.log("200 HTTP GET REGISTER Request was made " + getTimeStamp());
    res.render("register.ejs")
});

// Sign up logic
router.post("/register", (req, res) => {
    console.log("200 HTTP POST REGISTER Request was made " + getTimeStamp());
    let newUser = new User({ username: req.body.username });
    // Register stores the hash not the actual password.
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register.ejs")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/")
        });
    });
});

// Show login form
router.get("/login", (req, res) => {
    console.log("200 HTTP GET LOGIN Request was made " + getTimeStamp());
    res.render('login.ejs');
});

// Handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), (req, res) => {
        console.log("200 HTTP POST LOGIN Request was made " + getTimeStamp());
    });

// Logout Route
router.get("/logout", (req, res) => {
    console.log("200 HTTP GET LOGOUT Request was made " + getTimeStamp());
    req.logout();
    res.redirect("/");
});

module.exports = router;