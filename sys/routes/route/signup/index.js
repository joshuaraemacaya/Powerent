var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.get("/", (req, res) => {
	res.render("signup/index", req.query)
})

router.post("/", mid.nullch(__dirname), mid.numcheck, (req, res) => {
	const query = `
		insert into 
			user(user_fullname, user_name, user_password, user_bday, contact_no) 
		values("${req.body.name}", "${req.body.uname}", 
			"${req.body.password}", "${req.body.bdate}", "${req.body.contactno}")
		`
	db.query(query, (err, out) => {
		res.redirect("/login")
	})
})

exports.signup = router
