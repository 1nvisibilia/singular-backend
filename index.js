const express = require("express");
const server = express();
const routes = require("./api/routes");
const PORT = process.env.PORT || 9000;

server.use("/", routes);

server.listen(PORT, () => {
	console.log("Server starting on http://localhost:9000");
});
