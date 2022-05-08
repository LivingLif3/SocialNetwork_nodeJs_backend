import mongoose from "mongoose";
import { UserModel } from ".";

const MessageSchema = new mongoose.Schema({
    text:{
        require: true,
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    dialog:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Dialog"
    }
}, {
    timestamps: true
})
const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;