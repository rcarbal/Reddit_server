let mongoose= require("mongoose");
mongoose.connect("mongodb://localhost:27017/reddit_posts", {useNewUrlParser: true}, ()=>{
    console.log("Connected to MongoDB");
});

let postSchema = new mongoose.Schema({
    author: String,
    created: Number,
    subreddit_prefix: String,
    url: String,
    title: String,
    hint: String,
    thumbnail: String,
    fallback_url: String
})

let Post = mongoose.model("Post", postSchema);

//Adding a new post to the  Db
let newPost = new Post({
    author: "rcarbaleq2",
    created: 19393484923,
    subreddit_prefix: "Not real",
    url: "www.rcarbaleq2.com",
    title: "This is just a test",
    hint: "test",
    thumbnail: "no_thumbnail",
    fallback_url: "none"
});

newPost.save(function(error, post){
    if(error){
        console.log("SOMETHING WENT WRONg" + error);
    }else{
        console.log("WE JUST SAVED A POST TO THE DATABASE");
        console.log(post);
    }
});