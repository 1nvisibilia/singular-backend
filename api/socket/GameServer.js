const express = require("express");
const GameServer = express.Router();

const GameSocketManager = require("../../socket/GameSocketManager");
const frontEndURL = "http://localhost:8000";

function GameServerInitializer(server) {
	// Create and initialize the SocketIO server.
	// SocketSetup.setup(server, frontEndURL); // this method returns the io object.
	const gameSocketManager = new GameSocketManager(server, frontEndURL);

	// Creating a new socket game room
	GameServer.post("/create", (req, res) => {
		res.send(gameSocketManager.createGameRoom());
	});

	// Joining an existing socket game room
	GameServer.post("/join", (req, res) => {
		const roomID = req.params.roomID;
		res.json(gameSocketManager.canJoinGameRoom(roomID));
	});
	return GameServer;
}

module.exports = GameServerInitializer;
