// IMPORTS
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import fs from "fs";

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
    this.ready = false;
  }
}

// GAME VARIABLES
let players = [];
let roles = [];

// LOADING ROLES
try {
  roles = JSON.parse(fs.readFileSync("backend/roles.json"));
} catch (error) {
  console.error("Erro ao ler roles.json", error);
}

// FUNCTIONS
const addPlayer = (player) => players.push(player);
const removePlayer = (id) => {
  players = players.find((player) => player.id !== id);
};
const updatePlayerReady = (id, ready) => {
  const player = players.find((player) => player.id === id);
  if (player) {
    player.ready = ready;
  }
};

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (name, callback) => {
    if (!name) {
      return callback({ success: false, message: "Nome não pode ser vazio!" });
    }
    
    if (players.length > 0) {
      if (players.some((player) => player.name === name)) {
        return callback({ success: false, message: "Nome/Apelido em uso!" });
      }
    }

    const player = new Player(socket.id, name);
    addPlayer(player);
    io.emit("players", players);
    callback({ success: true });
    console.log(name + " joined with id: " + socket.id);
  });

  socket.on("getPlayers", () => {
    socket.emit("players", players);
  });

  socket.on("getRoles", () => {
    socket.emit("roles", roles);
  });

  socket.on("readyChange", (ready) => {
    updatePlayerReady(socket.id, ready);
    io.emit("players", players);
  });

  socket.on("disconnect", () => {
    if (players.length) {
      console.log(
        players.find((player) => player.id === socket.id).name + " disconnected"
      );
      removePlayer(socket.id);
      io.emit("players", players);
    }
  });
});

// SERVER LISTEN
server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
