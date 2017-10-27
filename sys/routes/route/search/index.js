var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", mid.sqlich(0, "item"), (req, res) => {
	const qs = `
		select user_id, user_fullname 
			from user
			where 
				user_fullname like "%${req.query.keyword}%" and
				user_id!=${req.session.user.user_id};
		select item_id, item_name, item_desc
			from item
			where owner_id!=${req.session.user.user_id} and cur_qty!=0 and
				item_name like "%${req.query.keyword}%" and
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
				);
		select org_id, org_name 
			from org 
			where org_name like "%${req.query.keyword}%";
		select * 
			from cat 
			where cat_name like "%${req.query.keyword}%";`

	db.query(qs, (err, out) => {
		res.render("search/index", {
			users: out[0], 
			items: out[1], 
			orgs: out[2],
			cats: out[3]
		})
	})
})

exports.search = router