import bcrypt from 'bcrypt';
import { UserModel } from '../Schems';
import { createToken } from '../utils';

class UserController{

    index(req, res){
        const id = req.params.id;
        UserModel.findById(id, (err, user) => {
            if(err){
                return res.status(404).json({message: "User not found"});
            }
            res.json(user);
        })
    }

    getMe(req, res){
        const id = req.user.data._doc._id;

        UserModel.findById(id, (err, user) => {
            if(err) return res.status(404).json({message: "User not found"});
            res.json(user);
        })
    }

    changeInformation = (req, res) => {
        const user = req.user.data._doc._id;
        let postData = {
            work: req.body.work,
            projects: req.body.projects,
            age: req.body.age
        }
        UserModel.findById(user, (err, user) => {
            if(err) return res.status(404).json({message: "User not found"});

            if(postData.work){
                user.work = postData.work
            }else if(postData.projects){
                user.projects = postData.projects
            }else if(postData.age){
                user.age = postData.age
            }
            user.save();
        })
    }

    create(req, res){
        const userData = {
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            age: null,
            work: null,
            projects: null
        }

        const user = new UserModel(userData);
        UserModel.findOne({email: userData.email}, (err, user) => {
            if(user) return res.json({message: "User is already registered"});
        })
        user.save().then((obj) => {
            res.send(obj);
        }).catch((reason) => {
            res.send(reason)
        })
    }

    login(req, res){
        let postData = {
            email: req.body.email,
            password: req.body.password
        }

        UserModel.findOne({email: postData.email}, (err, user) => {
            if(err){
                return res.status(404).json({message: "User not found"})
            }

            bcrypt.compare(postData.password, user.password, (err, result) => {
                if(err) return res.json({message: "Password isn't compared"});
                
                if(result){
                    let token = createToken(user);
                    res.json({
                        message: "Success",
                        token
                    })
                }else{
                    return req.json({status: "failed"})
                }
            })
        })
    }

    find(req, res){
        UserModel.find().or([{email: req.body.value}, {fullName: req.body.value}]).
        then((user) => {
            res.json(user);
        }).catch(() => {
            return res.status(404).json({message: "User no found"})
        })
    }

    delete(req, res){
        const id = req.params.id;

        UserModel.findOneAndRemove({_id: id}).then(user => {
            if(user) return res.json({message: `User ${user.fullName} deleted`})
        })
    }
}

export default UserController;