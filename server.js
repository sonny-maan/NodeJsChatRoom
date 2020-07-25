const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {getCurrentUser, userJoin, getRoomUsers, userLeaves} = require('./utils/users');
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
// Send Users and Room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });
  });
  


//Listen for chat messages
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  
//Message when a user leaves the chat room
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);
    if(user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat!`));
    //Send User and room info
    io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });
    }

  });
  
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));