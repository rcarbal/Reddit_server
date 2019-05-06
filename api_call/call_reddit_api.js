const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function loadDoc() {
    console.log("CALLED JSON")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          let response = this.responseText;
          console.log('REDDIT RESPONSE' + response);
          return response;
      }
    };
    xhttp.open("GET", "https://www.reddit.com/r/popular/top/.json?count=100", true);
    xhttp.send();
  }

  module.exports = { loadDoc 
}