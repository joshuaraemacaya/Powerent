var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use("/del", require("./del"))

router.use(mid.nauthed)

router.get("/", (req, res) => {
	const query = `
		select tprocs.*, item.*, cat.cat_name, user.user_fullname
		from tprocs, item, cat, user
		where tprocs.cart=1 and tprocs.renter_id=${req.session.user.user_id} and
			item.item_id=tprocs.item_id and item.cat_id=cat.cat_id and
			item.owner_id=user.user_id
		`
	db.query(query, (err, out) => {
		res.render("cart/index", {
			items: out
		})
	})
})

router.post("/", mid.nullch(__dirname), mid.sqlich(1, "cart"), (req, res) => {
	const check = `
		select cur_qty 
		from item, tprocs
		where tprocs.tproc_id=${req.body.id} and
			item.item_id=tprocs.item_id 
		`
	const query = `
		update tprocs 
		set qty=${req.body.qty}, pending=1, cart=0 
		where tproc_id=${req.body.id};
		update item
		set cur_qty=cur_qty - ${req.body.qty}
		where item_id=(
				select item_id
				from tprocs
				where tproc_id=${req.body.id}
			);`

	const query2 = `
		insert into 
			notifs(notif_desc, user_id)
		values("${req.session.user.user_fullname} wants to rent an item of yours. GO TO PENDING",
			(
				select owner_id
				from item JOIN tprocs 
				ON tprocs.tproc_id=${req.body.id} 
				AND tprocs.item_id = item.item_id
			));
		`
	db.query(check, (err, out) => {
		out[0].cur_qty < req.body.qty?
			res.redirect("/cart?unavailable"):
			db.query(query, (err, out) => {
				db.query(query2, (err, out) => {
					res.redirect("/cart")
				})
			})
	})
})	

exports.cart = router
