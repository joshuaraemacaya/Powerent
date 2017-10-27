var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", (req, res) => {
	const query = `select item.*, user.user_fullname, cat.cat_name 
		from item, user, cat \
		where item.owner_id=${req.session.user.user_id}=user.user_id and
			item.cat_id=cat.cat_id`

	db.query(query, (err, out) => {
		res.render("item/own", {
			items: out
		})
	})
})

exports.myitems = router
