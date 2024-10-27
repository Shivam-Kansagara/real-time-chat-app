const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const users = document.querySelector("#users");
const roomName = document.querySelector("#room-name");

const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get("username");
const room = urlParams.get("room");

socket.emit("joinRoom", { username, room });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = e.target.elements.msg.value;

  socket.emit("chatMessage", text);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

socket.on("message", (object) => {
  chatMessage.insertAdjacentHTML(
    "beforeend",
    `<div class="message">
          <p class="meta">${object.user} <span>${object.time}</span></p>
          <p class="text">${object.text}</p>
          </div>`
  );
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on("roomUsers", ({ room, usersList }) => {
  console.log(room, usersList);
  users.innerHTML = "";
  usersList.forEach((element) => {
    users.insertAdjacentHTML("beforeend", `<li>${element.username}</li>`);
  });
  roomName.innerHTML = `${room}`;
});
