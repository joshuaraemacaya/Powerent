var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)
router.use(mid.sqlich(0, "renting"))

router.get("/", (req, res) => {
	if(Object.keys(req.query).length == 0) {
		const query = `
			select 
				items_rented.*,
				item.item_name,
				item.item_desc,
				user.user_fullname
			from 
				items_rented, 
				item, 
				user
			where
				items_rented.item_id=item.item_id and
				items_rented.renter_id=${req.session.user.user_id} and
				item.owner_id=user.user_id
			`
		db.query(query, (err, out) => {
			res.render("renting/index", {
				items: out
			})
		})
	} else if(req.query.id) {
		const query = `
			select 
				items_rented.*, 
				item.*, 
				user.user_fullname, 
				cat.cat_name
			from 
				items_rented, 
				item, 
				user, 
				cat
			where
				items_rented.items_rented_id=${req.query.id} and
				items_rented.renter_id=${req.session.user.user_id} and
				items_rented.item_id=item.item_id and
				item.owner_id=user.user_id and 
				item.cat_id=cat.cat_id;
			select
				timediff(now(), start) as time_used
			from 
				items_rented
			where
				items_rented_id=${req.query.id};
			select
				((time_to_sec(timediff(now(), items_rented.start))/3600)*item.price_per_hr)*items_rented.qty_rented as price
			from
				items_rented, item
			where
				items_rented.items_rented_id=${req.query.id} and
				items_rented.item_id=item.item_id	
			`
		db.query(query, (err, out) => {
			if(!out[0])
				return res.redirect("/pending")
			else {
				res.render("renting/srenting", {
					dets: out[0],
					use: out[1][0].time_used,
					price: out[2][0].price.toFixed(2)
				})
			}
		})
	}
})

exports.renting = router