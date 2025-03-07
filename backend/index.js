// IMPORTS
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

// SERVER CONFIG
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// SERVER LISTEN
server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
