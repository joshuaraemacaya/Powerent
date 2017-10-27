var path = require("path")
var morgan = require("morgan")
var serve_static = require("serve-static")
var body_parser = require("body-parser")
var session = require("express-session")

module.exports = app => {
	app.set("port", 5555 || process.env.PORT || process.argv[2])
	app.set("views", path.dirname(__dirname) + "/views")
	app.set("view engine", "pug")
	app.use(morgan("dev"))
	app.use(serve_static(path.dirname(__dirname) + "/styles"))
	app.use(body_parser.urlencoded({extended: true}))
	app.use(session({
		resave: false,
		saveUninitialized: true,
		secret: "justoursecret"
	}))
}
