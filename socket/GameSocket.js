const { Server: SocketServer } = require("socket.io");
const Game = require("../engine/Game.js");

const currentGameStatus = "current game status";
const aPlayerJoined = "a user joined";
const aPlayerLeft = "a player left";
const requestInput = "request input";
const sendBackInput = "send back input";
const sendGameData = "send game data";
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
	 * @type { Map }
	 */
	userInputs;
	/**
	 * @type { String } id
	 */
	id;

	/**
	 * @param { SocketServer } io
	 * @param { String } roomID
	 */
	constructor(io, roomID) {
		this.game = new Game();
		this.eventLoop = null;
		this.userInputs = new Map();
		this.id = roomID;
		this.io = io;
	}

	/**
	 * @param { Socket } socket
	 */
	onJoin(socket) {
		console.log("a user connected", socket.id);

		const newPlayer = this.game.addPlayer(socket.id);
		if (newPlayer === null) {
			throw new Error("adding player failed, check the log");
		}

		socket.emit(currentGameStatus, this.game);

		const currentPlayers = this.game.players;
		// update all other players of the new player joined
		currentPlayers.forEach((currentPlayer) => {
			if (currentPlayer.id !== newPlayer.id) {
				this.io.to(currentPlayer.id).emit(aPlayerJoined, newPlayer);
			}
		});

		// setup the receiver for user inputs
		socket.on(sendBackInput, (inputData) => {
			this.userInputs.set(socket.id, inputData);
		});

		if (this.eventLoop === null) {
			this.activeEventLoop();
		}
	}

	/**
	 * @param { Number } socketID
	 */
	onLeave(socketID) {
		this.game.removePlayer(socketID);
		this.io.emit(aPlayerLeft, this.game);
	}

	/**
	 * @returns  { void }
	 */
	requestUserInputs() {
		this.game.players.forEach((currentPlayer) => {
			this.io.to(currentPlayer.id).emit(requestInput);
		});
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
			this.game.players.forEach((player) => {
				this.io.to(player.id).emit(sendGameData, this.game);
			});

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
}

module.exports = GameSocket;
