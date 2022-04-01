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
		res.status(201);
		res.send(gameSocketManager.createGameRoom());
	});

	// Joining an existing socket game room
	GameServer.post("/join/:roomID", (req, res) => {
		const roomID = req.params.roomID;
		const result = gameSocketManager.canJoinGameRoom(roomID);
		if (result.available === true) {
			res.status(202);
		} else {
			res.status(200);
		}
		res.json(result);
	});
	return GameServer;
}

module.exports = GameServerInitializer;
