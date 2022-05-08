import mongoose from "mongoose";

const DialogSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    partner:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    lastMessage: {
        require:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
})

const DialogModel = mongoose.model("Dialog", DialogSchema);

export default DialogModel;