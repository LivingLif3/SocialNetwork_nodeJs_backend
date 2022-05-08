import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        requred: true,
        index:{
            unique: true
        }
    },
    fullName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    work:{
        type: String,
        required: false
    },
    projects:{
        type: String,
        required: false
    },
    age:{
        type: String,
        required: false
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    last_seen:{
        type: Date
    }
}, {
    timestamps:true
})

UserSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt((err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);

            user.password = hash;

            next();
        })
    })
})

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;