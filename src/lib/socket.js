const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const server = createServer(app);
// Cấu hình Socket.IO với CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

module.exports = {server, io, app}