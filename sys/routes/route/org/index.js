var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use("/create", require("./create"))
router.use("/join", require("./join"))
router.use("/decline", require("./decline"))

router.use(mid.nauthed)

router.get("/", (req, res) => {
	if(Object.keys(req.query).length == 0) {
		const query = `
			select org.*, user.user_fullname
			from org, user
			where org.creator_id=user.user_id
			`
		db.query(query, (err, out) => {
			console.log(out)
			res.render("org/index", {
				orgs: out
			})
		})
	} else if(req.query.id) {
		const query = `
			select org.*, user.user_fullname
			from org, user
			where 
				org.org_id=${req.query.id} and
				org.creator_id=user.user_id;
			select user.user_fullname
			from user, org_members
			where
				org_members.user_id=user.user_id and
				org_members.org_id=${req.query.id}
			`
		db.query(query, (err, out) => {
			res.render("org/sorg", {
				dets: out[0],
				mbers: out[1],
				uid: req.session.user.user_id,
				oid: req.query.id
			})
		})
	}
})

router.post("/", (req, res) => {
	const query = `
		insert into 
			org_members(org_id, user_id)
		values
			(${req.body.oid}, ${req.body.uid});
		delete from jreqs
		where jreq_id=${req.body.id}
		`
	db.query(query, (err, out) => {
		res.redirect("/pending")
	})
})

exports.org = router