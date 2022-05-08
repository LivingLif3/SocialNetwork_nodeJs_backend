import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { createServer } from 'http';
import dotenv from "dotenv";
import { Server } from "socket.io";

import cors from 'cors';

import {UserController, DialogController, MessageController, PostController, CommentController} from './Controllers';
import {checkAuth} from "./middlewares/checkAuth";

const app = express();
const http = createServer(app);
const io = new Server(http);

dotenv.config();

const User = new UserController();
const Dialog = new DialogController(io);
const Message = new MessageController(io);
const Post = new PostController(io);
const Comment = new CommentController(io);

mongoose.connect('mongodb://localhost:27017/socialNetwork');

io.on('connection', () => {
    console.log('connect');
})

app.use(bodyParser.json());
app.use(cors());
app.use(checkAuth);

app.get('/user/me', User.getMe);
app.post("/user/find", User.find);
app.post('/user/registration', User.create);
app.post('/user/login', User.login);

app.get('/dialogs', Dialog.index);
app.post('/dialogs', Dialog.create);

app.get('/message/:id', Message.index);
app.post('/message', Message.create);
app.delete('/message/:id', Message.delete);

app.get('/posts', Post.getAll);
app.get('/post/like/:postId', Post.getLiked);
app.get('/post/:id', Post.index);
app.post('/post', Post.create);
app.post('/post/like', Post.like);
app.delete('/post/:postId', Post.delete);

app.get('/comments/:id', Comment.index);
app.post('/comment', Comment.create);
app.delete(`/comment/:id`, Comment.delete);


http.listen(8000, () => {
    console.log(`Server start on port ${8000}`)
})