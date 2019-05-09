const express = require('express'),
      apiCall = require('./database/database_setup.js');

const app = express();

// INDEX ROUTE
app.get("/index/json", (req, res)=>{
    let sendResponse = (string)=>{
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse);
});

// ROUTE ADD NEW POST
app.get("/index/new", (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .send("THIS IS THE ADD NEW POST GET ROUTE");
});

// ROUTE EDIT POST
app.get("/index/:id/edit", (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .send("THIS IS THE EDIT ROUTE");
});

app.get("/index/:id/delete", (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
    .send("THIS THE DELETE ROUTE");
});



app.listen(8000, ()=>{
    console.log("Reddit Server Started");

});

app.listen()