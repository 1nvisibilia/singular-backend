const secureRandomString = require("secure-random-string");
const GameSocket = require("./GameSocket.js");
const { Server: SocketServer } = require("socket.io");

const noRoom = "noRoom";
const joinRoom = "join room";
const leaveRoom = "leave room";

class GameSocketManager {
	/**
	 * @type { http.Server }
	 */
	httpServer;
	/**
	 * @type { Map<String, GameSocket> }
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
	 * @param { http.Server } server
	 * @param { String } frontEndURL
	 */
	constructor(server, frontEndURL) {
		this.httpServer = server;
		this.gameServers = new Map();
		this.connections = {};
		this.io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		// Setup basic connections
		this.io.on("connection", (socket) => {
			this.connections[socket.id] = noRoom;
			console.log(this.connections);
			socket.on("disconnect", () => {
				const roomID = this.connections[socket.id];
				// If the client is already in a game room, leave that room.
				if (roomID !== noRoom) {
					this.gameServers.get(roomID).onLeave(socket.id);
				}
				delete this.connections[socket.id];
				console.log(this.connections);
			});

			socket.on(joinRoom, (roomID) => {
				const gameSocket = this.gameServers.get(roomID);
				if (gameSocket === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				// update the gameSocket and the current players.
				gameSocket.onJoin(socket);
				// update the connection map object
				this.connections[socket.id] = gameSocket.roomID;
				console.log(this.connections);
			});

			socket.on(leaveRoom, (roomID) => {
				const gameSocket = this.gameServers.get(roomID);
				if (gameSocket === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				// update the gameSocket and the current players.
				gameSocket.onLeave(socket.id);
				// update the connection map object
				this.connections[socket.id] = noRoom;
				console.log(this.connections);
			});
		});
	}

	/**
	 * @returns { String } the room ID
	 */
	createGameRoom() {
		const roomID = secureRandomString({
			alphanumeric: true,
			length: 8
		});
		this.gameServers.set(roomID, new GameSocket(this.io, roomID));
		return roomID;
	}

	/**
	 * @returns { { available : Boolean, errorMessage: String } }
	 */
	canJoinGameRoom(roomID) {
		const gameSocket = this.gameServers.get(roomID);

		if (gameSocket === undefined) {
			return {
				available: false,
				errorMessage: "The room you are trying to join does not exist. Please double check you code."
			};
		} else if (gameSocket.game.isFull()) {
			return {
				available: false,
				errorMessage: "The room you are trying to join is already full."
			};
		}

		return {
			available: true,
			errorMessage: undefined
		};
	}
}

module.exports = GameSocketManager;
