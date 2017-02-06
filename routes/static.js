//static file hosting and routing!
//import express then the express router take note of capital R on the express router method!
var express = require("express")
var router = express.Router()



//host my local css and js files
router.use(express.static(__dirname + "/../public"))
router.use("/views", express.static(__dirname + "/../views"))

//use EJS to host main index file express has security concerns on hosting
router.get("/", function(req, res) {
	res.render("index.html.ejs")
})

//export router so that route can be used in main app
module.exports = router