import { MessageModel, DialogModel } from "../Schems";

class DialogController {
    constructor(io){
        this.io = io;
    }

    index(req, res){
        const authorId = req.user.data._doc._id;
        DialogModel.find().or([{author: authorId}, {partner: authorId}])
        .populate(["author", "partner"])
        .populate({
            path: 'lastMessage',
            populate: {
              path: 'user',
            },
          })
          .exec((err, dialogs) => {
              if(err) return res.json("Dialogs not found");

              res.json(dialogs);
          })
    }

    create = (req, res) => {
        const reqData = {
            author: req.user.data._doc._id,
            partner: req.body.partner
        }

        let dialog = new DialogModel(reqData);

        dialog.save().then((dialogObj) => {
            const message = new MessageModel({
                text: req.body.text,
                user: reqData.author,
                dialog: dialogObj._id
            });
            message.save().then( () => {
                dialogObj.lastMessage = message._id;

                dialogObj.save().then( () => {
                    res.json(dialogObj);

                    this.io.emit("SERVER:DIALOG_CREATED", dialogObj);
                })
            })
        }).catch( err => {
            res.json({message: err})
        })
    }

    delete = (req, res) => {
        const dialogId = req.params.id;

        DialogModel.findByIdAndRemove({_id: dialogId}).then( dialog => {
            if(dialog) return res.json({message: "Dialog has been deleted"})
        }).catch( err => {
            res.json({message: "Dialog not found"})
        })
    }
}

export default DialogController;