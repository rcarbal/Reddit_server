const apiCall = require('../api_call/call_reddit_api.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let mongoose = require("mongoose");
// POST SCHEMA
let postSchema = new mongoose.Schema({
  author: String,
  created: Number,
  subreddit_prefix: String,
  url: String,
  title: String,
  hint: String,
  thumbnail: String,
  fallback: String
});

// DATABASE CONNECT
let Post = mongoose.model("Post", postSchema);
mongoose.connect("mongodb://localhost:27017/reddit_posts", { useNewUrlParser: true }, () => {
  console.log("Connected to MongoDB");
  //loadDoc();
  //retrievePost();
});

// Get response api respinse
function loadDoc() {
  console.log("CALLED JSON")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.responseText;
      convertToJSONObjects(response);
    }
  };
  xhttp.open("GET", "https://www.reddit.com/r/popular/top/.json?count=24", true);
  xhttp.send();
}


function convertToJSONObjects(response) {
  let json = JSON.parse(response);

  let arr = json["data"]["children"];
  let returnArr = [];
  for (let i = 0; i < arr.length; i++) {
    let post = {};
    post.author = arr[i]["data"]["author"];
    post.created = arr[i]["data"]["created"];
    post.subreddit_name_prefixed = arr[i]["data"]["subreddit_name_prefixed"];
    post.url = arr[i]["data"]["url"];
    post.title = arr[i]["data"]["title"];
    post.hint = arr[i]["data"]["post_hint"];
    post.thumbnail = arr[i]["data"]["thumbnail"];
    if (checkJsonProperty("api", arr[i]["data"], "media", "reddit_video", "fallback_url")) {
      post.fallback_url = arr[i]["data"]["media"]["reddit_video"]["fallback_url"];
    }

    returnArr.push(post);
  }

  // Save to Database
  saveToDatabase(returnArr);

}

function checkJsonProperty(parseType, item, property, subproperty1, subproperty2) {
  if (parseType === "api") {
    if (item.hasOwnProperty(property) && item[property] !== null) {
      if (item[property].hasOwnProperty(subproperty1) && item[property][subproperty1] !== null) {
        if (item[property][subproperty1].hasOwnProperty(subproperty2) && item[property][subproperty1][subproperty2] !== null) {
          return true;
        }
      }
    }
    return false;
  } else if (parseType === "database") {
    if (item.hasOwnProperty && item[property] !== undefined) {
      return true;
    }
    return false;
  }
}

function saveToDatabase(postArray) {
  // Take array and save objects to database
  for (var i = 0; i < postArray.length; i++) {
    let hasFallback = checkJsonProperty("database", postArray[i], "fallback_url");
    let author = postArray[i]["author"],
      id = postArray[i]["id"],
      created = postArray[i]["created"],
      subreddit_prefix = postArray[i]["subreddit_name_prefixed"],
      url = postArray[i]["url"],
      title = postArray[i]["title"],
      hint = postArray[i]["hint"],
      thumbnail = postArray[i]["thumbnail"];

    let postSetup = {
      author: author,
      created: created,
      subreddit_prefix: subreddit_prefix,
      url: url,
      title: title,
      hint: hint,
      thumbnail: thumbnail,
    }
    if (hasFallback) {
      postSetup.fallback = postArray[i]["fallback_url"];;
    }

    // Created post from schema
    let newPost = Post(postSetup);
    addPostToDatabase(newPost);
  }
}

function addSinglePost(req, callback) {
  let fallback = "No fall_back",
    author = "No Author Yet",
    created = 0,
    subreddit_prefix = "No Subreddit Yet",
    url = req.body.url,
    title = req.body.post,
    hint = "image",
    thumbnail = "No thumbnail";

  let postSetup = {
    author: author,
    created: created,
    subreddit_prefix: subreddit_prefix,
    url: url,
    title: title,
    hint: hint,
    thumbnail: thumbnail
  }
  let newPost = Post(postSetup);
  addPostToDatabase(newPost, callback);
    
}

function getSiglePost(id, callback){
  Post.findById(id, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      callback(foundPost);
    }
  })
}

function updateSinglePost(id,url,post, callback){
  console.log("UPDATED INFORMATION");
  console.log(post);
  console.log(url);
  console.log(id);

  let object = {
    title: post,
    url: url
  }
  Post.findByIdAndUpdate(id, object, (err, updatedPost)=>{
    if(err){
      console.log(err);      
    }else{
      console.log("Updated post: " + updatedPost);
      callback();
    }
  });
}

function addPostToDatabase(newPost, callback) {
  newPost.save(function (error, post) {
    if (error) {
      console.log("SOMETHING WENT WRONG" + error);
    } else {
      console.log("WE JUST SAVED A POST TO THE DATABASE");
      console.log(post);
      console.log(callback);
      if(callback !== undefined){
        callback();
      }
    }
  });
}


// Delete Post from Database
function deletePost(id, callback){
  Post.findByIdAndDelete(id, (err, post)=>{
    if(err){
      console.log(err);
    }else{
      callback();
    }
  })
}

// RETRIEVE POST FROM DATABASE
function retrievePost(callback, user) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log("ERROR FOUND");
      console.log(err);
    } else {
      //convert post to JSON OBJECT
      convertToJSON(posts, callback, user);
    }
  });
}

function convertToJSON(jsonObject, callback, user) {
  let jsonConverted = JSON.parse(JSON.stringify(jsonObject));
  
  let userOb = {}
  if (user !== undefined && user !== null){
    userOb["user"] = user;
  }else{
    userOb["user"] = -1;
  }
  jsonConverted.push(userOb);
  let jsonString = JSON.stringify(jsonConverted);
  callback(jsonString);
}
module.exports = {
  retrievePost,
  addSinglePost,
  getSiglePost,
  updateSinglePost,
  deletePost
}