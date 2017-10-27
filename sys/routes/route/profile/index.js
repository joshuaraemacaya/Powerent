var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use("/edit", require("./edit"))

router.use(mid.nauthed)

router.get("/", (req, res) => {	
	const query = `
		select * 
		from user 
		where user_id=${req.session.user.user_id};
		select org_name
		from org
		where creator_id=${req.session.user.user_id};
		select org.org_name
		from user left join org_members 
			on user.user_id=org_members.user_id
			left join org
			on org_members.org_id=org.org_id
		where user.user_id=${req.session.user.user_id}	 
		`
	db.query(query, (err, out) => {
		res.render("profile/index", {
			details: out[0],
			owns: out[1],
			orgs: out[2]
		})
	})
})

exports.profile = router
