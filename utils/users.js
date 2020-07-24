const users = [];

//join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  
  users.push(user);
  
  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//User Leaves chat
function userLeaves() {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    return users.splice(index, 1);
  }
}

module.exports = {
  userJoin,
  getCurrentUser
}