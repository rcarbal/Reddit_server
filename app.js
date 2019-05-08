const express = require('express'),
      apiCall = require('./database/database_setup.js');

const app = express();

// INDEX ROUTE
app.get("/index/json", (req, res)=>{
    let sendResponse = (string)=>{
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse);
});



app.listen(8000, ()=>{
    console.log("Reddit Server Started");

});