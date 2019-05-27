const express = require('express');
      router = express.Router(),
      Post = require('../model/post'),
      Comment = require('../model/comment'),
      getTimeStamp = require('../utls/time_utils');


router.get("/index/:id/comments/new",isLoggedIn,  function (req, res) {
    console.log("200 HTTP GET NEW COMMENT Request was made " + getTimeStamp());
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { post: post })
        }
    });
});

router.post("/index/:id/comments/new",isLoggedIn, function (req, res) {
    console.log("200 HTTP POST COMMENT Request was made " + getTimeStamp());
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.redirec("/");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //Add user name and id to comment
                    comment.author.id  = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    post.comments.push(comment);
                    post.save();
                    res.redirect('/index/'+post._id);
                }
            });
        }
    });

});

router.get("/index/:id/comments/:comment_id/edit",checkCommentOwnership, function (req, res) {
    console.log("200 HTTP-GET EDIT COMMENT Request was made " + getTimeStamp());
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", {post: req.params.id, comment: foundComment});
        }
    });
});

router.post("/index/:id/comments/:comment_id/edit", function(req, res){
    console.log("200 HTTP-POST EDIT COMMENT Request was made " + getTimeStamp());
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/index/"+ req.params.id);
        }
    });
});


router.delete("/index/:id/comments/:comment_id/delete",checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            Post.findOne({'_id': req.params.id}, function(err, post){
                if(err){
                    console.log(err);
                }else{
                    post.comments.remove(req.params.comment_id);
                    post.save();
                }
            });
            res.redirect("/index/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

function checkCommentOwnership(req, res, next){
    // Fist check if any user is logged in 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                // Does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("/login");
    }
}
module.exports = router;