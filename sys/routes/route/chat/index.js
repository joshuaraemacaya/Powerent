var router = require("express").Router()
var db = require("../../../db")()
var mid = require("../../../midwares")

router.use(mid.nauthed)

router.get("/", (req, res) => {
    if(Object.keys(req.query).length === 0) {
    	const query = `
    		select distinct msg.sender as cont_id, user.user_fullname 
    		from msg, user
    		where 
    			msg.receiver=${req.session.user.user_id} and
    			msg.sender=user.user_id
    		union
    		select distinct msg.receiver, user.user_fullname
    		from msg, user
    		where 
    			msg.sender=${req.session.user.user_id} and
    			msg.receiver=user.user_id
    	`
    	db.query(query, (err, out) => {
    		res.render("chat/index", {
    			conts: out
    		})
    	})
	} else if(req.query.id) {
		const query = `
			select *
			from msg
			where 
				msg.sender=${req.session.user.user_id} and
				msg.receiver=${req.query.id} or
				msg.sender=${req.query.id} and
				msg.receiver=${req.session.user.user_id};
			select user_fullname
			from user
			where user_id=${req.query.id}
		`
		db.query(query, (err, out) => {
			console.log(out)
			res.render("chat/schat", {
				msgs: out[0],
				user: req.session.user.user_id,
				chatmate: req.query.id,
				chatname: out[1][0].user_fullname
			})
		})
	}
})

router.post("/", (req, res) => {
	const query = `
		insert into
			msg(sender, receiver, msg)
		values(
			${req.session.user.user_id},
			${req.body.id},
			"${req.body.msg}"
		)
	`
	db.query(query, (err, out) => {
		res.redirect(`/chat?id=${req.body.id}`)
	})
})

exports.chat = router
