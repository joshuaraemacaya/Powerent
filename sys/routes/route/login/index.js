var router = require("express").Router()
var mid = require("../../../midwares")
var db = require("../../../db")()

router.get("/", mid.authed, (req, res) => {
	res.render("login/index", req.query)
})

router.post("/", mid.nullch(__dirname), (req, res) => {
	const query = `
		select * 
		from user 
		where user_name="${req.body.uname}"
		`
	db.query(query, (err, out) => {
		if(!out[0])
			return res.redirect("/login?notfound")
		else {
			if(out[0].user_password !== req.body.password)
				return res.redirect("/login?incorrect")
			else {
				delete out[0].password
				req.session.user = out[0]
				return res.redirect("/item")
			}
		}
	})
})

exports.login = router
