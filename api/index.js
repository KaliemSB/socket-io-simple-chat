const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let messages = []

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    messages.push(msg)
    io.emit('chat message', msg);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.join(socket.id);

  io.to(socket.id).emit("get messages", messages)

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = app