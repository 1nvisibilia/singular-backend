const uuid = require('uuid');
const { Server: SocketServer } = require("socket.io");
const Game = require("../engine/Game.js");
const Player = require("../engine/Player.js");

const players = [];
const userIds = {};
const games = [];

const currentGameStatus = "current game status";
const newPlayerJoined = "new user joined";

/**
 *
 * @param { String } userID
 * @returns
 */
function removeUser(userID) {
	const disconnectedUserId = players.findIndex(player => player.id === userID);
	if (disconnectedUserId !== -1) {
		players.splice(disconnectedUserId, 1);
		return true;
	}
	return false;
}

const SocketSetup = {
	setup: function _setup(server, frontEndURL) {
		const io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		games.push(new Game());

		io.on('connection', (socket) => {
			userIds[socket.id] = true;
			const newPlayer = new Player(socket.id, 10, 10, 10);
			console.log("a user connected", socket.id);
			players.push(newPlayer);

			games[0].addPlayer(newPlayer);

			socket.emit(currentGameStatus, games);

			const currentPlayers = games[0].players;
			currentPlayers.forEach((currentPlayer) => {
				io.to(currentPlayer.id).emit(newPlayerJoined, newPlayer);
			});

			socket.on('disconnect', () => {
				delete userIds[socket.id];
				const removalStatus = removeUser(socket.id);
				games[0].removePlayer(socket.id);
				console.log(socket.id, "disconnected. removal status: ", removalStatus);
			});
		});

		return io;
	}
};

module.exports = SocketSetup;
