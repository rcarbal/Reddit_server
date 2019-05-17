  function getJSON(resolve, reject){
    console.log("CALLED JSON")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        resolve(this.responseText);
    }
    // else{
    //     console.log("Error Retirving JSON")
    //     reject()
    // }
  };
  xhttp.open("GET", "/index/json", true);
  xhttp.send();
  }

  export{
    getJSON
  }