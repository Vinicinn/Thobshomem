// IMPORTS
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

// SERVER CONFIG
const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// CLASS
class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

// GAME VARIABLES
var players = [];

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (name, callback) => {
    if (!name) {
      callback({ success: false, message: "Nome não pode ser vazio!" });
    } else {
      if (players.length) {
        if (players.find((player) => player.name === name)) {
          callback({ success: false, message: "Nome/Apelido em uso!" });
        } else {
          players.push(new Player(socket.id, name));
          callback({ success: true });
          console.log(name + " joined with id: " + socket.id);
        }
      } else {
        players.push(new Player(socket.id, name));
        callback({ success: true });
        console.log(name + " joined with id: " + socket.id);
      }
    }
  });

  socket.on("getPlayers", () => {
    socket.emit("players", players);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// SERVER LISTEN
server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
