const express = require('express'),
      apiCall = require('./api_call/call_reddit_api.js');

const app = express();

// INDEX ROUTE
app.get("/index/json", (req, res)=>{
    res.send("HERE IS THE JSON");
});

console.log(apiCall.loadDoc());



// app.listen(8000, ()=>{
//     console.log("Reddit Server Started");

// });