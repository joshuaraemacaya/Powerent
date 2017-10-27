var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.post("/", (req, res) => {
	console.log(req.body)
	const query = `
		update item
		set 
			cur_qty=cur_qty + ${req.body.qty}
		where item_id=${req.body.iid};
		delete from tprocs
		where
			tproc_id=${req.body.id}
		`
	db.query(query, (err, out) => {
		res.redirect("/pending")
	})
})

module.exports = router