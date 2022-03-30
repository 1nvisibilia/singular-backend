const uuid = require("uuid");
const GameSocket = require("./GameSocket.js");
const { Server: SocketServer } = require("socket.io");
const Game = require("../engine/Game.js");

const noRoom = "noRoom";

class GameSocketManager {
	/**
	 * @type { http.Server }
	 */
	httpServer;
	/**
	 * @type { Object } gameServers
	 * @key roomID: String
	 * @value gameSocket: GameSocket
	 */
	gameServers;
	/**
	 * @type { SocketServer } io
	 */
	io;
	/**
	 * @type { Object }
	 * @key socketID: String
	 * @value roomID: String | noRoom
	 */
	connections;

	/**
	 * 
	 * @param { http.Server } server 
	 * @param { String } frontEndURL 
	 */
	constructor(server, frontEndURL) {
		this.httpServer = server;
		this.gameServers = {};
		this.connections = {};
		this.io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		// Setup basic connections
		this.io.on("connection", (socket) => {
			this.connections[socket.id] = noRoom;
			socket.on("disconnect", () => {
				this.onDisconnect(socket.id);
			});
		});
	}

	/**
	 * @returns { String } the room ID
	 */
	createGameRoom() {
		gameServers[uuid.v4()] = new GameSocket();
	}
}

const SocketSetup = {
	setup: function _setup(server, frontEndURL) {
		const gameSocket = new GameSocket(server, frontEndURL);
		gameSocket.activeEventLoop();
		return gameSocket;
	}
};

module.exports = SocketSetup;
