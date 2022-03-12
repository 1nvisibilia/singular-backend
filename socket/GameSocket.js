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
	 * will expand this into multiple games later on...
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
	 * @param { http.Server } server
	 * @param { String } frontEndURL
	 */
	constructor(server, frontEndURL) {
		this.game = new Game();
		this.eventLoop = null;
		this.userInputs = new Map();

		this.io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		this.io.on("connection", (socket) => {
			this.onConnect(socket);
			socket.on("disconnect", () => {
				this.onDisconnect(socket.id);
			});

			socket.on(sendBackInput, (inputData) => {
				if (inputData !== null) {
					this.userInputs.set(socket.id, inputData);
				}
			});
		});
	}

	/**
	 * @param { Socket } socket
	 */
	onConnect(socket) {
		console.log("a user connected", socket.id);

		const newPlayer = this.game.addPlayer(socket.id, { health: 10 }); // we will check if room is full/ returns null.

		socket.emit(currentGameStatus, this.game);

		const currentPlayers = this.game.players;
		currentPlayers.forEach((currentPlayer) => {
			if (currentPlayer && currentPlayer.id !== newPlayer.id) {
				this.io.to(currentPlayer.id).emit(aPlayerJoined, newPlayer);
			}
		});
	}

	/**
	 * @param { Number } socketID
	 */
	onDisconnect(socketID) {
		this.game.removePlayer(socketID);
		this.io.emit(aPlayerLeft, this.game);
	}

	/**
	 * @returns  { void }
	 */
	requestUserInputs() {
		this.game.players.forEach((currentPlayer) => {
			if (currentPlayer !== null) {
				this.io.to(currentPlayer.id).emit(requestInput);
			}
		});
	}

	/**
	 * @returns { void }
	 */
	activeEventLoop() {
		if (this.eventLoop !== null) {
			throw "already an event loop going on, something's not right...";
		}
		this.eventLoop = setInterval(() => {
			// update the game engine's status
			this.game.updateEntities(this.userInputs);

			// emit game data back to players
			this.game.players.forEach((player) => {
				if (player !== null) {
					this.io.to(player.id).emit(sendGameData, this.game);
				}
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
