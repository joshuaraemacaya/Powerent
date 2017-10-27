var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)
router.use(mid.sqlich(1, "item"))

router.get("/", (req, res) => {
	const query = `select * from cat`

	db.query(query, (err, out) => {
		res.render("item/add", {
			cats: out
		})
	})
})

router.post("/", mid.nullch(__dirname + "/add"), (req, res) => {
	const query = `
		insert into 
			item(item_name, item_desc, cat_id, owner_id, price_per_hr,
				orig_qty, cur_qty) 
		values("${req.body.iname}", "${req.body.idesc}",
			${req.body.cid}, ${req.session.user.user_id}, ${req.body.price},
			${req.body.qty}, ${req.body.qty})`

	db.query(query, (err, out) => {
		res.redirect("/myitems")		
	})
})

module.exports = router