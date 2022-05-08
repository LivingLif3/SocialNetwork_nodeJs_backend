import { ProjectsModel } from "../Schems";

class ProjectsController{

    constructor(io){
        this.io = io;
    }

    index(req, res){
        let id = req.params.id;

        ProjectsModel.find({_id: id}).populate("author")
        .exec( (err, post) => {
            if(err) return res.json({message: "Dialog not found"});

            res.json(post);
        })
    }

    create = (req, res) => {
        const author = req.user.data._doc._id;

        const reqData = {
            author: author,
            title: req.body.title,
            description: req.body.description
        }

        const post = new ProjectsModel(reqData);

        post.save().then( post => {
            res.json(post);

            this.io.emit("SERVER:POST_CREATED", post);
        }).catch( reason => {
            res.json(reason)
        })
    }
    delete(req, res){
        let id = req.params.id;

        ProjectsModel.findByIdAndRemove(id).then( (err, post) => {
            if(err) return res.json({message: "Post not found"});

            if(post){
                res.json({message: "Post has been deleted"})
            }
        } )
    }
}

export default ProjectsController;