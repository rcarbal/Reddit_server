const apiCall = require('../api_call/call_reddit_api.js');

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/reddit_posts", { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
});

function addCallToDatabase() {
    //call the database
    const promise = new Promise(function(resolve){
      resolve(apiCall.loadDoc());
    }).then(function(result){
      console.log(result);
    });
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
        if (checkJsonProperty(arr[i]["data"], "media", "reddit_video", "fallback_url")) {
            post.fallback_url = arr[i]["data"]["media"]["reddit_video"]["fallback_url"];
        }

        returnArr.push(post);
    }

    console.log(returnArr);

}

function checkJsonProperty(item, property, subproperty1, subproperty2) {
    if (item.hasOwnProperty(property) && item[property] !== null) {
      if (item[property].hasOwnProperty(subproperty1) && item[property][subproperty1] !== null) {
        if (item[property][subproperty1].hasOwnProperty(subproperty2) && item[property][subproperty1][subproperty2] !== null) {
          return true;
        }
      }
    }
    return false;
  }

addCallToDatabase();

// let postSchema = new mongoose.Schema({
//     author: String,
//     created: Number,
//     subreddit_prefix: String,
//     url: String,
//     title: String,
//     hint: String,
//     thumbnail: String,
//     fallback_url: String
// })

// let Post = mongoose.model("Post", postSchema);

//Adding a new post to the  Db
// let newPost = new Post({
//     author: "rcarbaleq2",
//     created: 19393484923,
//     subreddit_prefix: "Not real",
//     url: "www.rcarbaleq2.com",
//     title: "This is just a test",
//     hint: "test",
//     thumbnail: "no_thumbnail",
//     fallback_url: "none"
// });

// newPost.save(function(error, post){
//     if(error){
//         console.log("SOMETHING WENT WRONg" + error);
//     }else{
//         console.log("WE JUST SAVED A POST TO THE DATABASE");
//         console.log(post);
//     }
// });

// Retrieve post from the database
// Post.find({}, function(err, posts){
//     if(err){
//         console.log("ERROR FOUND");
//         console.log(err);
//     }else{
//         console.log("ALLL THE POSTS");
//         console.log(posts);
//     }
// });