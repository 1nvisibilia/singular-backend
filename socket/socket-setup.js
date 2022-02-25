const uuid = require('uuid');
const { Server: SocketServer } = require("socket.io");
const users = {};
const games = {};


const SocketSetup = {
	setup: function _setup(server, frontEndURL) {
		const io = new SocketServer(server, {
			cors: {
				origin: frontEndURL
			}
		});

		io.on('connection', (socket) => {
			users[socket.id] = true;
			console.log('a user connected', users);

			socket.on('disconnect', () => {
				delete users[socket.id];
			});
		});

		return io;
	}
};

// const Game = require("../engine/Game");

// const game = new Game();

module.exports = SocketSetup;
