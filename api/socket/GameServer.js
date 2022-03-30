const express = require("express");
const GameServer = express.Router();

const SocketSetup = require("../../socket/GameSocketManager");
const frontEndURL = "http://localhost:8000";

function GameServerInitializer(server) {
	// Create and initialize the SocketIO server.
	SocketSetup.setup(server, frontEndURL); // this method returns the io object.

	// Creating a new socket game room
	GameServer.post("/create", (req, res) => {
		res.send("creating server");
	});

	// Joining an existing socket game room
	GameServer.post("/join", (req, res) => {
		res.send("joining a room");
	});
	return GameServer;
}

module.exports = GameServerInitializer;
