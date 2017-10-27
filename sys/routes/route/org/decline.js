var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.post("/", (req, res) => {
	console.log(req.body)
	const query = `
		delete from jreqs
        where jreq_id=${req.body.id}
	`
	db.query(query, (err, out) => {
		res.redirect("/pending")
	})
})

module.exports = router

