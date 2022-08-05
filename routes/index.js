var express = require('express');
var router = express.Router();

router.get('/:key', async function (req, res, next) {
	const key = req.params.key;
	try {
		// temp as no server ready
		// if (key !== "007d1d8e-425f-474d-a8a0-7235cad917c6") {
		// 	throw new Error("Opps, Something went wrong")
		// }
		//
		return res.render('index', {
			key: key,
		});
	} catch {
		return res.render('error', {
		});
	}

})


module.exports = router;