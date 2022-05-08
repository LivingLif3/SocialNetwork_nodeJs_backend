import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

const ProjectModel = mongoose.model("Project", ProjectSchema);

export default ProjectModel;