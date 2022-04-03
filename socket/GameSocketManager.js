const secureRandomString = require("secure-random-string");
const { instrument } = require("@socket.io/admin-ui");
const GameSocket = require("./GameSocket.js");
const { Server: SocketServer } = require("socket.io");
const whiteList = ["https://admin.socket.io"];

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
	 * @type { Map<String, String> }
	 */
	connections;

	/**
	 * @param { http.Server } server
	 * @param { String } frontEndURL
	 */
	constructor(server, frontEndURL) {
		this.httpServer = server;
		this.gameServers = new Map();
		this.connections = new Map();
		this.io = new SocketServer(server, {
			cors: {
				credentials: true,
				origin(address, callBack) {
					if (address === frontEndURL || whiteList.indexOf(address) !== -1) {
						callBack(null, true)
					} else {
						callBack(new Error(address + " is not allows by CORS"));
					}
				}
			}
		});

		// Setup for socket UI audit
		instrument(this.io, {
			auth: {
				type: "basic",
				username: "j63tao",
				password: "$2b$10$HaqEkvsFFeFkcWtAR2yoU.sBu8M3wNwVXqOFUi4xbBtkIUHVyxiLS"
			}
		});

		// Setup basic connections
		this.io.on("connection", (socket) => {
			this.connections.set(socket.id, noRoom);
			console.log(this.connections);
			socket.on("disconnect", () => {
				const roomID = this.connections.get(socket.id);
				// If the client is already in a game room, leave that room.
				if (roomID !== noRoom && typeof roomID === "string") {
					const gameSocket = this.gameServers.get(roomID);
					gameSocket.onLeave(socket);

					// if the room is empty after the client left, delete the room
					if (gameSocket.empty() === true) {
						this.gameServers.delete(roomID);
					}
				}
				this.connections.delete(socket.id);
				console.log(this.connections);
				console.log([...this.gameServers.keys()]);
			});

			socket.on(joinRoom, (gameInfo) => {
				const gameSocket = this.gameServers.get(gameInfo.roomID);
				if (gameSocket === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				// update the gameSocket and the current players.
				gameSocket.onJoin(socket, gameInfo.playerName);
				// update the connection map
				this.connections.set(socket.id, gameSocket.roomID);
				console.log(this.connections);
				console.log([...this.gameServers.keys()]);
			});

			socket.on(leaveRoom, (roomID) => {
				const gameSocket = this.gameServers.get(roomID);
				if (gameSocket === undefined) {
					throw new Error("Invalid Room ID, change this to a socket emit error to the front end later");
				}

				// update the gameSocket and the current players.
				gameSocket.onLeave(socket);
				// update the connection map object
				this.connections.set(socket.id, noRoom);

				// if the room is empty after the client left, delete the room
				if (gameSocket.empty() === true) {
					this.gameServers.delete(roomID);
				}
				console.log(this.connections);
				console.log([...this.gameServers.keys()]);
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
	 * @param { String } roomID
	 * @param { String } playerName
	 * @returns { { available : Boolean, errorMessage: String } }
	 */
	canJoinGameRoom(roomID, playerName) {
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
		} else if (gameSocket.game.nameExist(playerName) === true) {
			return {
				available: false,
				errorMessage: "This username already exist in the game. Consider using another one."
			};
		}

		return {
			available: true,
			errorMessage: undefined
		};
	}
}

module.exports = GameSocketManager;
