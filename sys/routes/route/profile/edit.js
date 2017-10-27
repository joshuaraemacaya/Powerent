var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", (req, res) => {
	const query = `
		select *
		from user
		where user_id=${req.session.user.user_id}
		`
	db.query(query, (err, out) => {
		res.render("profile/edit", {
			dets: out
		})
	})
})

router.post("/", (req, res) => {
	const query = `
		update user 
		set 
			user_fullname="${req.body.fname}", user_name="${req.body.uname}",
			user_bday="${req.body.bday}", contact_no="${req.body.contactno}"
		where user_id=${req.session.user.user_id}
		`
	db.query(query, (err, out) => {
		res.redirect("/profile")
	})
})

module.exports = router