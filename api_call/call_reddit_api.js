const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

module.exports = {
  loadDoc
}