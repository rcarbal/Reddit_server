const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// USING BASIC HTTPRequest
function loadDoc() {
  console.log("CALLED JSON")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.responseText;
      console.log("Response Returned");
      return response;
    }
  };
  xhttp.open("GET", "https://www.reddit.com/r/popular/top/.json?count=24", true);
  xhttp.send();
}

// USING Fetch
function get(){
  return fetch("https://www.reddit.com/r/popular/top/.json?count=24");
}

function getJSON(url){
  return get(url).then(function(response){
    console.log(response.json);
    return response.json;
  })
}

module.exports = {
  loadDoc, get
}