//import/require all the necessary npm modules
var express = require("express")
var bodyParser = require("body-parser")

//this dictates the app will use be a express framework app
var app = express()

//here we use body parser to parse JSON
app.use(bodyParser.json())
app.use(require("./routes/static"))
app.use(require("./routes/api/api"))

var server = app.listen(process.env.PORT, function() {
	console.log("connected on port", process.env.PORT)
})