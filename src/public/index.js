const socket = io();
const chatbox = document.getElementById("chatbox");
let user = sessionStorage.getItem("user") || "";

//SweetAlert
if (!user) {
  Swal.fire({
    title: "Auth",
    input: "text",
    text: "Set username",
    inputValidator: (value) => {
      return !value.trim() && "Please write a username";
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
    document.getElementById("username").innerHTML = user;
    sessionStorage.setItem("user", user);
    socket.emit("new", user);
  });
} else {
  document.getElementById("username").innerHTML = user;
  socket.emit("new", user);
}

//Enviar mensajes
chatbox.addEventListener("keyup", (event) => {
  console.log('ok');
  if (event.key === "Enter") {
    const msn = chatbox.value.trim();

    if (msn.length > 0) {
      const date = new Date();
      const hourDate = date.getHours();
      const minuteDate = date.getMinutes();
      const hour = `${hourDate}:${minuteDate}`;

      socket.emit("client:message", {
        user,
        message: msn,
        hour: hour,
      });

      chatbox.value = "";
    }
  }
});

//Recibir mensajes
socket.on("server:messages", (data) => {
  const divLogs = document.getElementById("logs");
  let messages = "";

  data.forEach((message) => {
    messages =
      `<p><b>${message.user}:</b> ${message.message}<i style="font-size: x-small; margin-left: 5px;">${message.hour}</i></p>` +
      messages;
  });

  divLogs.innerHTML = messages;
});