var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", mid.sqlich(0, "item"), (req, res) => {
	if(Object.keys(req.query).length === 0) {
		const query = `select * from cat`

		db.query(query, (err, out) => {
			res.render("cat/index", {
				cats: out
			})
		})
	} else if(req.query.id) {
		const query = `
			select item.*, user.user_fullname
			from item, user
			where owner_id!=${req.session.user.user_id} and cur_qty!=0 and
				not exists(
					select item_id
					from tprocs
					where tprocs.item_id=item.item_id and
						tprocs.renter_id=${req.session.user.user_id}
				) and not exists(
					select item_id
					from items_rented
					where items_rented.item_id=item.item_id and
						items_rented.renter_id=${req.session.user.user_id}
				) and cat_id=${req.query.id} and item.owner_id=user.user_id;
			select cat_name
			from cat
			where cat_id=${req.query.id}
			`
		db.query(query, (err, out) => {
			res.render("cat/scat", {
				items: out[0],
				cats: out[1]
			})
		})
	} else
		res.redirect("/item")
})

exports.cat = router