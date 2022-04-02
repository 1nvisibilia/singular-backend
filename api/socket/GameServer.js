const express = require("express");
const bodyParser = require("body-parser");
const GameServer = express.Router();

const GameSocketManager = require("../../socket/GameSocketManager");
const frontEndURL = "http://localhost:8000";

GameServer.use(bodyParser.json());

function playerNameCheck(req, res, next) {
	if (req.body.playerName.trim().length === 0) {
		res.status(400);
		res.send("You name cannot be empty or consist of only white spaces");
	} else {
		next();
	}
}

function GameServerInitializer(server) {
	// Create and initialize the SocketIO server.
	const gameSocketManager = new GameSocketManager(server, frontEndURL);

	// Creating a new socket game room
	GameServer.post("/create", [playerNameCheck], (req, res) => {
		const roomID = gameSocketManager.createGameRoom();
		res.status(201);
		res.send(roomID);
	});

	// Joining an existing socket game room
	GameServer.post("/join", [playerNameCheck], (req, res) => {
		const playerName = req.body.playerName;
		const roomID = req.body.roomID;
		const result = gameSocketManager.canJoinGameRoom(roomID, playerName);
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
