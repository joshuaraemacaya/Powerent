var router=require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", (req, res) => {
	const query = `
		select * 
		from notifs
		where user_id=${req.session.user.user_id}
		`
	db.query(query, (err, out) => {
		res.render("notifs/index", {
			notifs: out
		})
	})
})

exports.notifs = router
