const uuid = require("uuid");
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
				const roomID = this.connections[socket.id];
				if (roomID !== noRoom) {
					this.gameServers[roomID].onLeave(socket.id);
				}
			});

			socket.on(joinRoom, (roomID) => {
				const game = this.gameServers[roomID];
				if (game === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				// update the game and the current players.
				game.onJoin(socket);
			});

			socket.on(leaveRoom, (roomID) => {
				const game = gameServers[roomID];
				if (game === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				game.onLeave(socket.id);
			});
		});
	}

	/**
	 * @returns { String } the room ID
	 */
	createGameRoom() {
		const roomID = uuid.v4();
		this.gameServers[roomID] = new GameSocket(this.io, roomID);
		return roomID;
	}

	/**
	 * @returns { { available : Boolean, errorMessage: String } }
	 */
	canJoinGameRoom(roomID) {
		const game = this.gameServers[roomID];

		if (game === undefined) {
			return {
				available: false,
				errorMessage: "The room you are trying to join does not exist. Please double check you code."
			};
		} else if (false) {
			// check if the room is full
			// return { avaliable: false, ... }
		}

		this.connections[socket.id] = game.id;

		return {
			available: true,
			errorMessage: undefined
		};
	}
}

module.exports = GameSocketManager;
