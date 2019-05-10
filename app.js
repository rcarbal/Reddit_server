const express = require('express'),
      apiCall = require('./database/database_setup.js'),
      app = express();
      path = require('path');

app.use(express.static('public'));

// INDEX ROUTE
app.get("/", (req, res)=>{
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    // res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // res.status(200)
    res.sendFile('index.html')
});

//JSON RESPONSE ROUTE
app.get("/index/json", (req, res)=>{
    console.log("200 HTTP GET JSON Request was made "  + getTimeStamp());

    let sendResponse = (string)=>{
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse);
});

// ROUTE ADD NEW POST
app.get("/index/new", (req, res)=>{
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .render("new.ejs")
});

// ROUTE EDIT POST
app.get("/index/:id/edit", (req, res)=>{
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .send("THIS IS THE EDIT ROUTE");
});

//DELETE POST
app.get("/index/:id/delete", (req, res)=>{
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .send("THIS THE DELETE ROUTE");
});

function getTimeStamp(){
    var currentDate = new Date();
    return currentDate;
}



app.listen(8000, ()=>{
    console.log("Reddit Server Started");

});

app.listen()