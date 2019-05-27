const express = require('express'),
      router = express.Router(),
      Post = require('../model/post'),
      apiCall = require('../database/database_setup'),
      getTimeStamp = require('../utls/time_utils');

//JSON RESPONSE ROUTE
router.get("/index/json", (req, res) => {
    console.log("200 HTTP GET JSON Request was made " + getTimeStamp());
    let user = req.user;
    let sendResponse = (string) => {

        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200).send(string);
    }
    apiCall.retrievePost(sendResponse, user);
});

// ROUTE ADD NEW POST
router.get("/index/new", isLoggedIn, (req, res) => {
    console.log("200 HTTP GET NEW POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.status(200)
        .render("new.ejs")
});


router.post("/index/new", isLoggedIn, (req, res) => {
    console.log("200 HTTP POST NEW Post Request was made " + getTimeStamp());
    let callback = () => {
        res.redirect("/");
    }
    apiCall.addSinglePost(req, callback)

});

router.get("/index/:id", function(req, res){
    console.log("200 HTTP GET POST INFO BY ID Request was made " + getTimeStamp());
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("posts/post", {post: foundPost});
        }
    });
});



// ROUTE EDIT POST
router.get("/index/:id/edit", (req, res) => {
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());

    if (req.isAuthenticated()) {
        let id = req.params.id;
        let callback = function passCallback(post) {
            res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
            res.status(200)
                .render("edit.ejs", { id: id, post: post });
        }
        apiCall.getSiglePost(id, req, res, callback)
    } else {
        res.redirect("/login");
    }
});

router.post("/index/:id/edit", (req, res) => {
    console.log("200 HTTP GET EDIT POST Request was made " + getTimeStamp());
    let id = req.params.id;
    let url = req.body.url;
    let post = req.body.post;

    let callback = () => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.status(200)
            .redirect("/");
    }
    apiCall.updateSinglePost(id, url, post, callback, req, res);

});

//DELETE POST

router.get("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");
    let callback = (post) => {
        res.render('delete.ejs', { id: post.id, title: post.title });
    }
    apiCall.getSiglePost(req.params.id, req, res, callback)


});
router.post("/index/:id/delete", (req, res) => {
    console.log("200 HTTP GET DELETE POST Request was made " + getTimeStamp());
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    console.log("GET POST DELETE ROUTE");

    let callback = () => {
        res.redirect('/');
    }
    apiCall.deletePost(req.params.id, callback, res, req)

});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;