var express = require('express');
var router = express.Router();

router.get('/:key', async function (req, res, next) {
	const key = req.params.key;
	try {
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