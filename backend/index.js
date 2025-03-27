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
let allReady = false;

// LOADING ROLES
try {
  roles = JSON.parse(fs.readFileSync("backend/roles.json"));
} catch (error) {
  console.error("Erro ao ler roles.json", error);
}

// FUNCTIONS
const addPlayer = (player) => players.push(player);
const removePlayer = (id) => {
  players = players.filter((player) => player.id !== id);
};
const updatePlayerReady = (id, ready) => {
  const player = players.find((player) => player.id === id);
  if (player) {
    player.ready = ready;
    if (player.ready) {
      console.log(player.name + " is ready");
    } else {
      console.log(player.name + " is not ready");
    }
  }
};
const verifyAllReadyPlayers = () => {
  return players.every((player) => player.ready);
};

// SOCKET EVENTS
io.on("connection", (socket) => {
  socket.join("login");
  console.log("User connected to login page");

  socket.on("join", (name, callback) => {
    // VERIFY EMPTY NAME
    if (!name) {
      return callback({ success: false, message: "Nome não pode ser vazio!" });
    }

    // VERIFY DUPLICATE NAME
    if (players.length > 0) {
      if (players.some((player) => player.name === name)) {
        return callback({ success: false, message: "Nome/Apelido em uso!" });
      }
    }

    // CREATE PLAYER OBJECT
    const player = new Player(socket.id, name);
    addPlayer(player);
    // SWITCH PLAYER ROOM
    socket.leave("login");
    socket.join("lobby");
    // UPDATE PLAYERS IN THE LOBBY
    io.to("lobby").emit("players", players);
    // RETURN SUCCESS TO CLIENT
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
    // UPDATE PLAYER READY STATUS
    updatePlayerReady(socket.id, ready);
    // UPDATE PLAYERS IN THE LOBBY
    io.to("lobby").emit("players", players);
    // VERIFY IF ALL PLAYERS ARE READY
    if (verifyAllReadyPlayers()) {
      console.log("all players ready");
      allReady = true;
      io.to("lobby").emit("allReady", true);
    } else {
      if (allReady == true) {
        console.log("all players NOT ready");
        allReady = false;
        io.to("lobby").emit("allReady", false);
      }
    }
  });

  socket.on("startGame", () => {
    console.log("comecando o jogo");

    const gameId = Math.floor(Math.random() * 9000);

    io.to("lobby").emit("gameId", gameId);
    socket.leave("lobby");
    socket.join("game");
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
