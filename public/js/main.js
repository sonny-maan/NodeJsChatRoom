const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//Get message from server and output
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

//Scroll down anytime a message is received
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

//User submits message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  //Get message text
  const msg = e.target.elements.msg.value;
  
  //Emit message to server
  socket.emit('chatMessage', msg);
  
  //Clear message input box
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = 
    `<p class="meta">Sonny <span>9:12pm</span> </p>
		<p class="text"> ${message} </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}
