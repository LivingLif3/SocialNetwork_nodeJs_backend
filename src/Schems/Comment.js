import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text:{
        require: true,
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Post"
    }
}, {
    timestamps: true
})
const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;