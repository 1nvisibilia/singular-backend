// Create the express server
const express = require("express");
const app = express();
const cors = require("cors");
const routeInitializer = require("./api/routes");

// Creating the Http server
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;
const whiteList = ["http://localhost:8000", "https://admin.socket.io"];

// Allowing for Cross-origin Access
app.use(cors({
	credentials: true,
	origin(origin, callback) {
		if (whiteList.includes(origin)) {
			return callback(null, true);
		}
		callback(new Error('Not allowed by CORS'));
	}
}));

// Setting up the routes
app.use("/api", routeInitializer({ server }));

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:" + PORT);
});
