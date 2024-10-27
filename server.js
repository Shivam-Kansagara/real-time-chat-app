const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  getCurrentUser,
  userJoin,
  userLeft,
  getRoomUsers,
  users,
} = require("./utils/user");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

const chatBot = "chat_bot";
io.on("connection", (socket) => {
  socket.on("joinRoom", (object) => {
    const user = userJoin(socket.id, object.username, object.room);
    socket.join(user.room);
    socket.emit("message", formatMessage(chatBot, `welcome to ${user.room}`));

    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(chatBot, `${user.username} joined`));

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      usersList: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (s) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, s));
  });
  socket.on("disconnect", () => {
    const user = userLeft(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatBot, `${user.username} left`)
      );
      console.log(getRoomUsers(user.room));
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        usersList: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on ${port}`);
  console.log(`http://localhost:${port}`);
});

app.get("/chat.html", (req, res) => {
  const username = req.query.username;
  const room = req.query.room;
  res.sendFile(path.join(__dirname, "_html_css", "chat.html"));
});
app.use(express.static("_html_css"));
