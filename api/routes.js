const express = require("express");
const router = express.Router();

const GameServerInitializer = require("./socket/GameServer");

function routeInitializer(applicationData) {
	// Handle all game socket related APIs.
	router.use("/game", GameServerInitializer(applicationData.server));

	router.get("/", (req, res) => {
		res.send("sup");
	});

	return router;
}

module.exports = routeInitializer;
