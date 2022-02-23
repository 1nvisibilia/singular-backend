// Create the express server
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./api/routes");

// Creating the Http socker server
const http = require("http");
const server = http.createServer(app);
const { Server: SocketServer } = require("socket.io");
const frontEndURL = "http://localhost:8000";
const PORT = process.env.PORT || 9000;
const io = new SocketServer(server, {
	cors: {
		origin: frontEndURL
	}
});


// Setting up the routes
app.use("/", routes);

// Allowing for Cross-origin Access
app.use(cors());

io.on('connection', (socket) => {
	console.log(socket);
	console.log('a user connected');
});

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:" + PORT);
});
