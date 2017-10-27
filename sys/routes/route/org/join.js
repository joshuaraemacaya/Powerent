var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.post("/", (req, res) => {
	console.log(req.body)
	const query = `
		insert into
			jreqs(
				user_id,
				org_id
			)
		values(
			${req.body.uid},
			${req.body.oid}
		)
	`
	db.query(query, (err, out) => {
		res.redirect("/org")
	})
})

module.exports = router

