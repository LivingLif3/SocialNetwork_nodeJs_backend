import mongoose from "mongoose";
import { CommentModel, PostModel } from "../Schems";

class CommentController {
    constructor(io){
        this.io = io;
    }

    index(req, res) {
        let postId = req.params.id;
        CommentModel.find({post: postId}).populate(["user", "post"]).exec((err, comments) => {
            if(err) return res.json({message: "Post not found"});

            res.json(comments);
        })
    }

    create = (req, res) => {
        let author = req.user.data._doc._id;
        let postData = {
            text: req.body.text,
            user: author,
            post: req.body.post
        }

        let comment = new CommentModel(postData);

        comment.save().then(comment => { 
            PostModel.findById(postData.post, (err, post) => {
                post.comments.push(comment);
                post.save()
                res.json(comment)
                this.io.emit("SERVER:COMMENT_CREATED")
            })
        }).catch(reason => {
            res.json(reason);
        })
    }

    delete = (req, res) => {
        let commentId = req.params.id;

        CommentModel.findByIdAndRemove(commentId).then( (comment, err) => {
            if(err) res.json({message: "Comment not found"});
            if(comment) {
                //PostModel.findOneAndUpdate({_id: comment.post, comments: {$elemMatch: {_id: commentId}}}, { $pull: {comments: {_id:commentId}}})
                PostModel.findOneAndUpdate({ _id: comment.post}, {$pull: {comments: comment}},
                {
                    useFindAndModify: false
                },
                (err) => {
                    if(err) return res.json({message: "Some error"})

                    this.io.emit("SERVER:COMMENT_DELETED");
                    res.json({message: "Comment has been deleted"})
                })
                // PostModel.findById(comment.post, (err, post) => {
                    
                //     post.comments.splice(index, 1);
                //     post.save();
                //     this.io.emit("SERVER:COMMENT_DELETED");
                //     res.json({message: "Comment has been deleted"})
                // })
                
            }
        })
    }
}

export default CommentController;