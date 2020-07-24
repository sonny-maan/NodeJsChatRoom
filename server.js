const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {getCurrentUser, userJoin} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatBot';

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
  const user = userJoin(socket.id, username, room);
  socket.join(user.room);
    
//Welcome a user to the chat
  socket.emit('message', formatMessage(botName, 'Welcome to NodeChat!'));
  
//Broadcast a message to all other users when someone new enters the room
  socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat!`));
  
  });

//Listen for chat messages
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  
//Message when a user leaves the chat room
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat!'));
  });
  
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));