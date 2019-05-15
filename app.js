const express = require('express'),
    apiCall = require('./database/database_setup.js'),
    token = require('./utls/token_utils.js')
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash");
    app = express();

;
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

//JSON RESPONSE ROUTE
app.get("/index/json", (req, res) => {
    console.log("200 HTTP GET JSON Request was made " + getTimeStamp());

    let sendResponse = (string) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse);
});
//Login route
app.get("/login", (re, res)=>{

    res.send("The current session state token is "+token.makeid(32));
})


// INDEX ROUTE
app.get("/", (req, res) => {
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    // res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // res.status(200)
    res.sendFile('index.html')
});


// ROUTE ADD NEW POST
app.get("/index/new", (req, res) => {
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

function getTimeStamp() {
    var currentDate = new Date();
    return currentDate;
}



app.listen(7000, () => {
    console.log("Reddit Server Started");

});

app.listen();