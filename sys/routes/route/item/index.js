var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use("/monitor", require("./monitor"))
router.use("/add", require("./add"))
router.use("/returned", require("./returned"))

router.use(mid.nauthed)
router.use(mid.sqlich(0, "item"))
router.use(mid.sqlich(1, "item"))

router.get("/", (req, res) => {
	if(Object.keys(req.query).length === 0) {
		const query = `
			select item_id, item_name, item_desc
			from item
			where owner_id!=${req.session.user.user_id} and cur_qty!=0
			`
		db.query(query, (err, out) => {
			res.render("item/index", {
				items: out,
				online: req.session.user.user_fullname
			})
		})
	} else if(req.query.id) {
		const query = `
			select item.*, cat.cat_name, user.user_id, user.user_fullname 
			from item, cat, user 
			where item.item_id=${req.query.id} and item.cat_id=cat.cat_id
				and item.owner_id=user.user_id
			`
		db.query(query, (err, out) => {
			if(out[0].owner_id != req.session.user.user_id) {
				!out[0]?
					res.redirect("/item/none"):
					res.render("item/sitem", {
						details: out
					})
			} else res.redirect("/item")
		})
	} else {
		res.redirect("/item")
	}
})

router.post("/", (req, res) => {
	const query = `
		insert into
			tprocs(item_id, renter_id)
		values(${req.body.iid}, ${req.session.user.user_id});
		update tprocs 
		set cart=1, pending=0
		where item_id=${req.body.iid} and renter_id=${req.session.user.user_id} 
		`
	db.query(query, (err, out) => {
		res.redirect("/item")
	})
})

exports.item = router