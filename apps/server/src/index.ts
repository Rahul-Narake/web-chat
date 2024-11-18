import { app, server } from './socket/socket';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/user.route';
import conversationRouter from './routes/conversation.route';

app.use('/api/v1/user', userRouter);
app.use('/api/v1/conversation', conversationRouter);

server.listen(port, () => {
  console.log(`Server is listening on port:: ${port}`);
});
