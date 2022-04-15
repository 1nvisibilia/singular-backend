// Create the express server
const express = require("express");
const app = express();
const cors = require("cors");
const routeInitializer = require("./api/routes");
const errorMessage = require("./direct-access");

// Creating the Http server
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;
const whiteList = ["http://localhost:8000", "https://admin.socket.io"];

// Allowing for Cross-origin Access
app.use(cors({
	credentials: true,
	origin(_origin, callback) {
		return callback(null, true);
	}
}));

// Only allow whitelist origins to make API requests
app.use("/", (req, res, next) => {
	const originURL = req.get("origin");
	console.log(originURL);
	const allow = whiteList.find((url) => {
		return url.includes(originURL);
	});

	if (allow !== undefined) {
		next();
	} else {
		res.status(401);
		res.send(errorMessage);
	}
});

// Setting up the routes
app.use("/api", routeInitializer({ server }));

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:" + PORT);
});
