const express = require("express");
const router = express.Router();

router.get("/api/sup", (req, res) => {
	res.send("lmfao");
});

router.get("/", (req, res) => {
	res.send("sup");
});


module.exports = router;