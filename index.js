// Create the express server
const express = require("express");
const app = express();
const cors = require("cors");
const routeInitializer = require("./api/routes");

// Creating the Http server
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;

// Allowing for Cross-origin Access
app.use(cors());

// Setting up the routes
app.use("/api", routeInitializer({ server }));

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:" + PORT);
});
