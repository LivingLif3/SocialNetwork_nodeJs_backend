import { MessageModel, DialogModel } from '../Schems';

class MessageController{

    constructor(io){
        this.io = io;
    }

    index(req, res){
        let dialogId = req.params.id;

        MessageModel.find({dialog: dialogId})
        .populate(["dialog"])
        .exec((err, messages) => {
            if(err) return res.json({message: "Messages not found"});

            res.json(messages);
        })
    }


    create = (req, res) => {
        let reqBody = {
            text: req.body.text,
            user: req.user.data._doc._id,
            dialog: req.body.dialog
        }

        const message = new MessageModel(reqBody);
        message.save().then( obj => {
            obj.populate("dialog", (err, message) => {
                if(err) return res.status(500).json({message: err});

                DialogModel.findById(reqBody.dialog).then(dialog => {
                    dialog.lastMessage = message._id;

                    dialog.save();
                })

                res.json(message);
                this.io.emit("SERVER:SEND_MESSAGE", message);
                this.io.emit("SERVER:DIALOG_CREATED");
            })
        })
    }

    delete = (req, res) => {
        let message = req.params.id;

        MessageModel.findOneAndRemove({_id: message}).then( user => {
            if(user){
                this.io.emit("SERVER:MESSAGE_DELETED");
                res.json({message: "Message deleted"});
            }
        }).catch(() => {
            res.status(404).json({message: "Message not found"});
        })
    }
}

export default MessageController;