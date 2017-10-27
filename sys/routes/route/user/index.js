var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", mid.sqlich(0, "item"), (req, res) => {
	if(Object.keys(req.query).length === 0) {
		const query = `
			select user_id, user_fullname
			from user
			where user_id!=${req.session.user.user_id}
			`
		db.query(query, (err, out) => {
			res.render("user/index", {
				users: out
			})
		})
	} else if(req.query.id) {
		const query = `
			select *
			from user
			where user_id=${req.query.id};
			select org.org_name
			from user left join org_members 
				on user.user_id=org_members.user_id
				left join org
				on org_members.org_id=org.org_id
			where user.user_id=${req.query.id}	 
			`
		if(req.query.id == req.session.user.user_id)
			res.redirect("/profile")
		else {
			db.query(query, (err, out) => {
				console.log(out)
				res.render("user/suser", {
					dets: out[0],
					orgs: out[1]
				})
			})
		}
	} else
		res.redirect("/item")
})

exports.user = router