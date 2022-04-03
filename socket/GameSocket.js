const { Server: SocketServer, Socket } = require("socket.io");
const Game = require("../engine/Game.js");

const currentGameStatus = "current game status";
const aPlayerJoined = "a user joined";
const aPlayerLeft = "a player left";
const requestInput = "request input";
const sendBackInput = "send back input";
const sendGameData = "send game data";
const sendChatMessage = "send chat message";
const broadcastMessage = "broadcast message";
const updateFrequency = 25; // does this affect the front-end animation frame? why?

class GameSocket {
	/**
	 * @type { Game }
	 */
	game;
	/**
	 * @type { SocketServer } io
	 */
	io;
	/**
	 * @type { Number | null } eventLoop
	 */
	eventLoop;
	/**
	 * @type { Map } userInputs
	 */
	userInputs;
	/**
	 * @type { String } roomID
	 */
	roomID;

	/**
	 * @param { SocketServer } io
	 * @param { String } roomID
	 */
	constructor(io, roomID) {
		this.game = new Game();
		this.eventLoop = null;
		this.userInputs = new Map();
		this.roomID = roomID;
		this.io = io;
	}

	/**
	 * @param { Socket } socket
	 * @param { String } playerName
	 */
	onJoin(socket, playerName) {
		socket.join(this.roomID);

		const newPlayer = this.game.addPlayer(socket.id, playerName);
		if (newPlayer === null) {
			throw new Error("adding player failed, check the log");
		}

		socket.emit(currentGameStatus, this.game);

		// update all other players of the new player joined
		socket.to(this.roomID).emit(aPlayerJoined, newPlayer);

		// setup the receiver for user inputs
		socket.on(sendBackInput, (inputData) => {
			this.userInputs.set(socket.id, inputData);
		});

		// start receiving messages
		socket.on(sendChatMessage, (msg) => {
			const sender = this.game.players.find((player) => {
				return player.id === socket.id;
			});
			this.io.to(this.roomID).emit(broadcastMessage, {
				senderName: sender.name,
				message: msg
			});
		});

		if (this.eventLoop === null) {
			this.activeEventLoop();
		}
	}

	/**
	 * @param { Socket } socket
	 */
	onLeave(socket) {
		// Unregister all event listeners of the client
		socket.removeAllListeners(sendBackInput);
		socket.removeAllListeners(sendChatMessage);

		// Remove the client from the game
		this.game.removePlayer(socket.id);
		if (this.empty() === true) {
			this.deactiveEventLoop();
		} else {
			this.io.to(this.roomID).emit(aPlayerLeft, this.game);
		}
	}

	/**
	 * @returns  { void }
	 */
	requestUserInputs() {
		this.io.to(this.roomID).emit(requestInput);
	}

	/**
	 * @returns { void }
	 */
	activeEventLoop() {
		if (this.eventLoop !== null) {
			throw new Error("already an event loop going on, something's not right...");
		}
		this.eventLoop = setInterval(() => {
			// update the game engine's status
			this.game.updateEntities(this.userInputs);

			// emit game data back to players
			this.io.to(this.roomID).emit(sendGameData, this.game);

			// request user input
			this.requestUserInputs();
		}, updateFrequency);
	}

	/**
	 * @returns { void }
	 */
	deactiveEventLoop() {
		clearInterval(this.eventLoop);
		this.eventLoop = null;
	}

	/**
	 * @returns { Boolean } if the room has no players
	 */
	empty() {
		return this.game.isEmpty();
	}
}

module.exports = GameSocket;
