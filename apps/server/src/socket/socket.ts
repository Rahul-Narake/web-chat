import { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';
import { UserManager } from '../UserManager';
import url from 'url';

const app = express();
const server = http.createServer(app);
const wss: WebSocketServer = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const userId = url.parse(req?.url!, true).query.userId;
  if (userId) UserManager.getInstance().addUser(ws, String(userId));
});

export { wss, server, app };
