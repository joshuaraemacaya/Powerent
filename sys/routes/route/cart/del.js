var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.post("/", (req, res) => {
	const query = `
		delete from tprocs
		where
			tproc_id=${req.body.id}
		`

	db.query(query, (err, out) => {
		res.redirect("/cart")
	})
})

module.exports = router