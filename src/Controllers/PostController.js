import { PostModel } from "../Schems";

class PostController{

    constructor(io){
        this.io = io;
    }

    index(req, res){
        let id = req.params.id;

        PostModel.find({_id: id}).populate("author")
        .exec( (err, post) => {
            if(err) return res.json({message: "Dialog not found"});

            res.json(post);
        })
    }

    getAll(req, res){
        PostModel.find().populate("author").populate({
            path: 'comments.user',
            model: "User"
        })
        .exec( (err, posts) => {
            if(err) return res.json({message: "Can't receive posts"});

            res.json(posts);
        })
    }

    create = (req, res) => {
        const author = req.user.data._doc._id;

        const reqData = {
            author: author,
            cost: req.body.cost,
            title: req.body.title,
            description: req.body.description,
            likes: 0,
            liked: []
        }

        const post = new PostModel(reqData);

        post.save().then( post => {
            res.json(post);

            this.io.emit("SERVER:POST_CREATED", post);
        }).catch( reason => {
            res.json(reason)
        })
    }

    delete = (req, res) => {
        let postId = req.params.postId;

        PostModel.findOneAndRemove({_id: postId}).then(post => {
            if(!post) return res.json({message: "Post not found"});

            res.json(post);
            this.io.emit("SERVER:POST_DELETED", post);
        })
    }

    like = (req, res) => {
        let postId = req.body.postId;
        let user = req.user.data._doc._id;

        PostModel.findById(postId, (err, post) => {
            if(err) return res.json({message: "Not found"});
            let index = post.liked.indexOf(user);
            if(index == -1){
                post.likes += 1;
                post.liked.push(user);
                res.json({liked: true, likes: post.likes, postId: postId})
            }else if(index > -1){
                post.liked.splice(index, 1);
                post.likes -= 1;
                res.json({liked: false, likes: post.likes, postId: postId})
            }
            this.io.emit("SERVER:POST_LIKED", post);
            post.save()
        })
    }

    getLiked(req, res){
        let postId = req.params.postId;
        let user = req.user.data._doc._id;

        PostModel.findById(postId, (err, post) => {
            if(err) return res.json({message:"Not found"});
        
            let index = post.liked.indexOf(user);

            if(index != -1){
                res.json({liked: true, likes: post.likes})
            }else{
                res.json({liked: false, likes: post.likes})
            }
        })
    }
}

export default PostController;