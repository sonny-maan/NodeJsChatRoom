const socket = io();
const chatForm = document.getElementById('chat-form');

socket.on('message', message => {
  console.log(message);
});

//User submits message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  //Get message text
  const msg = e.target.elements.msg.value;
  
  console.log(msg);
});