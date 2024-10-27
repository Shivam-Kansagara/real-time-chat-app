const users = [];

function userJoin(userId, username, room) {
  const user = { userId, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(userId) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId === userId) {
      return users[i];
    }
  }
}

function userLeft(userId) {
  const index = users.findIndex((user) => user.userId == userId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => {
    return user.room === room;
  });
}

module.exports = { getCurrentUser, userJoin, userLeft, getRoomUsers, users };
