var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use("/decline", require("./decline"))

router.use(mid.nauthed)

function con(par) {
	return (par < 10? '0': '') + par
}

function dcon(par) {
	return (par >= 24? Math.floor(par/24): 0)
}

router.get("/", (req, res) => {
	const query = `
		select tprocs.*, item.item_name, user.user_fullname
		from tprocs, item, user
		where tprocs.item_id=item.item_id and
			item.owner_id=${req.session.user.user_id} and tprocs.pending=1 and
			tprocs.renter_id=user.user_id;
		select
			jreqs.*,
			org.org_name,
			user.user_fullname
		from
			jreqs,
			org,
			user
		where
			jreqs.org_id=org.org_id and
			jreqs.user_id=user.user_id and
			org.creator_id=${req.session.user.user_id}
		`
	db.query(query, (err, out) => {
		res.render("pending/index", {
			items: out[0],
			reqs: out[1]
		})
	})
})

router.post("/", (req, res) => {
	var date = new Date()
	var start = 
		date.getFullYear() + "-" +
		con(date.getMonth() + 1) + "-" +
		con(date.getDate()) + " " +
		con(date.getHours()) + ":" +
		con(date.getMinutes()) + ":" +
		con(date.getSeconds())
	var id = req.body.id
	
	const query = `
		insert into 
			items_rented(
				item_id, renter_id, qty_rented, start
			) 
		values((
			select item_id 
			from tprocs 
			where tproc_id=${id}
		), (
			select renter_id
			from tprocs 
			where tproc_id=${id}
		), (
			select qty 
			from tprocs 
			where tproc_id=${id}
		), "${start}");
		delete from tprocs where tproc_id=${id}
		`
	db.query(query, (err, out) => {
		res.redirect("/pending")
	})
})

exports.pending = router
