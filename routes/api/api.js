var router = require("express").Router()
var bodyParser = require("body-parser")

router.get("/api/myKey", function(req, res) {
	res.json({key:process.env.OWMKEY}).status(200)	
})

module.exports = router