var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('list all adapters');
});

router.post('/register', function(req, res, next){
	console.log(req.body);
	res.send('NYI');
});

module.exports = router;
