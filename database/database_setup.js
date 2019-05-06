const MongoClient= require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017/reddit_posts';

MongoClient.connect(url, (err, db)=>{
    console.log("Connected sucessfylly to MongoDB server")
});