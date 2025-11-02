const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const server = createServer(app);
// Cấu hình Socket.IO với CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});
// const io = new Server(server, { cors: { origin: '*', methods: ['GET','POST'], credentials: true } });

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});


module.exports = {server, io, app}