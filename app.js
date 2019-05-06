const express = require('express'),
      apiCall = require('./api_call/call_reddit_api.js');

const app = express();

console.log(apiCall.loadDoc());

app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("Reddit Server Started");
});