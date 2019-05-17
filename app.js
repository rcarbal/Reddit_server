const express = require('express'),
      apiCall = require('./database/database_setup.js'),
      token = require('./utls/token_utils.js'),
      passport = require('passport'),
      LocalStrategry = require('passport-local'),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      flash = require("connect-flash");
      User = require("./model/user.js"),
      app = express();

;
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

//JSON RESPONSE ROUTE
app.get("/index/json", (req, res) => {
    console.log("200 HTTP GET JSON Request was made " + getTimeStamp());

    let sendResponse = (string) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse);
});

// INDEX ROUTE
app.get("/", (req, res) => {
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    // res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // res.status(200)
    res.sendFile('index.html')
});


// ROUTE ADD NEW POST
app.get("/index/new",isLoggedIn ,(req, res) => {
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
        .render("new.ejs")
});

app.post("/index/new", (req, res) => {
    console.log("200 HTTP POST NEW Post Request was made " + getTimeStamp());
    let callback = () => {
        console.log("Redirecting");
        //req.flash("Added new post");
        res.redirect("/");
    }
    apiCall.addSinglePost(req, callback)

});

// ROUTE EDIT POST
app.get("/index/:id/edit", (req, res) => {
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());
    let id = req.params.id;
    let callback = (post) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200)
            .render("edit.ejs", { id: id, post: post });

    }
    apiCall.getSiglePost(id, callback)
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
    apiCall.updateSinglePost(id, url, post, callback)

});

//DELETE POST

app.get("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");
    let callback =(post)=>{
        res.render('delete.ejs', { id: post.id, title: post.title });
    }
    apiCall.getSiglePost(req.params.id, callback)
    
    
});
app.post("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");

    let callback = ()=>{       
        res.redirect('/');
    }    
    apiCall.deletePost(req.params.id, callback)
    
});


//=====================
// AUTH ROUTES
//=====================

//show register
app.get("/register", (req, res)=>{
    res.render("register.ejs")
});

// Sign up logic
app.post("/register", (req, res)=>{
    let newUser = new User({username: req.body.username});
    // Register stores the hash not the actual password.
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/")
        });
    }); 
});

// Show login form
app.get("/login", (req, res)=>{
    res.render('login.ejs');
});

function getTimeStamp() {
    var currentDate = new Date();
    return currentDate;
};

// Handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }),(req, res)=>{
    res.send("LOGIN LOGIC HAPPENS HERE");
});

// Logout Route
app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}



app.listen(7000, () => {
    console.log("Reddit Server Started");

});

app.listen();