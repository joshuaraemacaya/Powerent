var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", (req, res) => {
	res.render("org/create")
})

router.post("/", (req, res) => {
	const query = `
		insert into org
			(org_name, creator_id)
		values
			("${req.body.name}", ${req.session.user.user_id})
		`
	db.query(query, (err, out) => {
		return res.redirect("/org")
	})
})

module.exports = router