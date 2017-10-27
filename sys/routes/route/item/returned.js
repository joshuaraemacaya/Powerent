var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.post("/", (req, res) => {
	console.log(req.body)
	const query = `
		delete from items_rented
		where items_rented_id=${req.body.id};
		update item
		set cur_qty=cur_qty + ${req.body.qty}
		where item_id=${req.body.iid}
		`
	db.query(query, (err, out) => {
		res.redirect("/item/monitor")
	})
})

module.exports = router