var fs = require("fs")

module.exports = app => {
	fs.readdir(__dirname + "/route", (err, mods) => {
		if(err) console.err

		mods.forEach( cur => {
			var route = require(`./route/${cur}`)
			app.use(`/${cur}`, route[cur])
		})
	})
}
