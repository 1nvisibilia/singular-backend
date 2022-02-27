// const uuid = require("uuid"); // for different game rooms.
const { Server: SocketServer } = require("socket.io");
const Game = require("../engine/Game.js");

/**
 * @typedef { { id : Number } } User
 */
/**
 * @type { User[] }
 */
const users = [];
/**
 * @type { Game[] }
 */
const games = [];
games.push(new Game());

const currentGameStatus = "current game status";
const newPlayerJoined = "new user joined";

/**
 *
 * @param { String } userID
 * @returns { Boolean } : if removal is successful
 */
function removeUser(userID) {
	const disconnectedUserIndex = users.findIndex(user => user.id === userID);
	if (disconnectedUserIndex !== -1) {
		users.splice(disconnectedUserIndex, 1);
		return true;
	}
	return false;
}

/**
 * @param { Socket } socket
 * @param { SocketServer } io
 */
function onConnect(socket, io) {
	users.push({ id: socket.id });
	console.log("a user connected", socket.id);

	const newPlayer = games[0].addPlayer(socket.id, { health: 10 }); // we will check if room is full/ returns null.

	socket.emit(currentGameStatus, games[0]);

	const currentPlayers = games[0].players;
	currentPlayers.forEach((currentPlayer) => {
		if (currentPlayer.id !== newPlayer.id) {
			io.to(currentPlayer.id).emit(newPlayerJoined, newPlayer);
		}
	});
}

/**
 * @param { Number } socketID
 */
function onDisconnect(socketID) {
	const removalStatus = removeUser(socketID);
	games[0].removePlayer(socketID);
	console.log(socketID, "disconnected. removal status: ", removalStatus);
}

const SocketSetup = {
	setup: function _setup(server, frontEndURL) {
		const io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		io.on("connection", (socket) => {
			onConnect(socket, io);

			socket.on("disconnect", () => {
				onDisconnect(socket.id);
			});
		});

		return io;
	}
};

module.exports = SocketSetup;
