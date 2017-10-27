exports.authed = (req, res, next) => {
	req.session.user?
		res.redirect("/item"):
		next()
}

exports.nauthed = (req, res, next) => {
	req.session.user?
		next():
		res.redirect("/login")
}

exports.sqlich = (defn, rert) => {
	return (req, res, next) => {
		if(defn == 0) {
			keys = Object.keys(req.query)
			check = req.query
		} else if(defn == 1) {
			keys = Object.keys(req.body)
			check = req.body
		}
		var len = keys.length
		var re = /([\W+])/
		var flag = false
		var x

		if(keys.length === 0)
			flag = false
		else {
			for(x=0; x<len; x++) {

				if(re.test(check[keys[x]])) {
					flag = true
					break
				} else
					flag = false
			}
		}

		flag?
			res.redirect("/" + rert):
			next()
	}
}

exports.nullch = rname => {
	return(req, res, next) => {
		var rtlen = rname.split("\\").length
		var rt = rname.split("\\")[rtlen - 1]
		var rs = Object.keys(req.body)
		var flag = false

		rs.forEach( cur => {
			if(!req.body[cur])
				flag = true
		})
		
		flag?
			res.redirect(`/${rt}?noninput`):
			next()
	}
}

exports.numcheck = (req, res, next) => {
	if(Number(req.body.contactno))
		next()
	else
		res.redirect("/signup?invalidnum")
}