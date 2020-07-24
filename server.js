const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', socket => {
  
  const botName = 'ChatBot';
  
//Welcome a user to the chat
  socket.emit('message', formatMessage(botName, 'Welcome to NodeChat!'));
  
//Broadcast a message to all other users when someone new enters the room
  socket.broadcast.emit('message', formatMessage(botName, 'A user has entered the chat!'));
  
//Message when a user leaves the chat room
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat!'));
  });
  
//Listen for chat messages
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });
  
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));