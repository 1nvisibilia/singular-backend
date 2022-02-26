// Create the express server
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./api/routes");

// Creating the Http server
const http = require("http");
const server = http.createServer(app);
const frontEndURL = "http://localhost:8000";
const PORT = process.env.PORT || 9000;

// Create and initialize the SocketIO server.
const SocketSetup = require("./socket/socket-server");
SocketSetup.setup(server, frontEndURL); // this method returns the io object.

// Allowing for Cross-origin Access
app.use(cors());

// Setting up the routes
app.use("/", routes);

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:" + PORT);
});
