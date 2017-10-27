var router = require("express").Router()

router.get("/", (req, res) => {
	req.session.destroy(err => {
		if(err) console.err
		res.redirect("/login")
	})
})

exports.logout = router
