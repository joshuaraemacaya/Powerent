var app = require("express")()
require("dotenv").config()
require("./sys/boot")(app)
require("./sys/routes")(app)

app.get('/', (req, res) => {
	res.redirect("/login")
})

app.listen(app.get("port"), () => {
	console.log(`Now listening on http://localhost:${app.get("port")}`)
})
