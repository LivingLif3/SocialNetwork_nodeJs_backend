import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    cost:{
        type: String,
        require: true
    },
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    likes:{
        type: Number,
        require: true
    },
    liked:{
        type: Array,
        require: true
    },
    comments: {
        type: mongoose.Schema.Types.Array,
        ref: "Comment"
    }
},{
    timestamps: true
})

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;