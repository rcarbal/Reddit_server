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

// INDEX ROUTE
app.get("/", (req, res) => {
    console.log(req.user);
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    res.sendFile('public/static_index.html', { root: __dirname });
});

//JSON RESPONSE ROUTE
app.get("/index/json", (req, res) => {
    console.log("200 HTTP GET JSON Request was made " + getTimeStamp());
    let user = req.user;
    let sendResponse = (string) => {

        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse, user);
});

app.get('/index/:id', function(req, res){
    res.send("This is the comment section.");
});


// ROUTE ADD NEW POST
app.get("/index/new", isLoggedIn, (req, res) => {
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
        .render("new.ejs")
});

app.post("/index/new", isLoggedIn, (req, res) => {
    console.log("200 HTTP POST NEW Post Request was made " + getTimeStamp());
    let callback = () => {
        res.redirect("/");
    }
    apiCall.addSinglePost(req, callback)

});

// ROUTE EDIT POST
app.get("/index/:id/edit", (req, res) => {
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());

    if (req.isAuthenticated()) {
        let id = req.params.id;
        let callback = function passCallback(post) {
            res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
            res.status(200)
                .render("edit.ejs", { id: id, post: post });
        }
        apiCall.getSiglePost(id, req, res, callback)
    } else {
        res.redirect("/login");
    }
});

app.post("/index/:id/edit", (req, res) => {
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());
    let id = req.params.id;
    let url = req.body.url;
    let post = req.body.post;

    let callback = () => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200)
            .redirect("/");
    }
    apiCall.updateSinglePost(id, url, post, callback, req, res);

});

//DELETE POST

app.get("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");
    let callback = (post) => {
        res.render('delete.ejs', { id: post.id, title: post.title });
    }
    apiCall.getSiglePost(req.params.id, req, res, callback)


});
app.post("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");

    let callback = () => {
        res.redirect('/');
    }
    apiCall.deletePost(req.params.id, callback, res, req)

});


//=====================
// AUTH ROUTES
//=====================

//show register
app.get("/register", (req, res) => {
    console.log("200 HTTP GET REGISTER Request was made " + getTimeStamp());
    res.render("register.ejs")
});

// Sign up logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
    console.log("200 HTTP GET LOGIN Request was made " + getTimeStamp());
    res.render('login.ejs');
});

// Handling login logic
app.post("/login", passport.authenticate("local",

    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), (req, res) => {
        console.log("200 HTTP POST LOGIN Request was made " + getTimeStamp());
    });

// Logout Route
app.get("/logout", (req, res) => {
    console.log("200 HTTP GET LOGOUT Request was made " + getTimeStamp());
    req.logout();
    res.redirect("/");
});


//=========================================
// Comments Route
//==========================================

app.get("/index/:id/comments/new", function (req, res) {
    console.log("200 HTTP GET NEW COMMENT Request was made " + getTimeStamp());
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { post: post })
        }
    });
});

app.post("/index/:id/comments/new", function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.redirec("/");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {

                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/index/'+post._id);
                }
            });
        }
    });

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

function getTimeStamp() {
    var currentDate = new Date();
    return currentDate;
};


app.listen(7000, () => {
    console.log("Reddit Server Started");
});

app.listen();