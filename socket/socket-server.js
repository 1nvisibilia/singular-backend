// const uuid = require("uuid"); // for different game rooms.
const GameSocket = require("./GameSocket.js");

const SocketSetup = {
	setup: function _setup(server, frontEndURL) {
		const gameSocket = new GameSocket(server, frontEndURL);
		gameSocket.activeEventLoop();
		return gameSocket;
	}
};

module.exports = SocketSetup;
