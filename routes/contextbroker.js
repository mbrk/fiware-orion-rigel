var express = require('express');
var router = express.Router();
var config = require('../scripts/config.js');
var orion = require('../scripts/orion-rest.js');
/*
var Orion = require('fiware-orion-client');
var OrionClient = new Orion.Client({
	url: config.ORION_SERVER,
	userAgent: 'Dataflow-Agent',
	timeout: 5000
});

var entity = {
	type: 'Car',
	pattern: '*',
	attributes: [{
		name: 'buildYear',
		type: typeof ''
	}]
};
var params = {
	callback: 'http://localhost:3000/contextbroker/callback'
};
*/


var json = {
	"attributes" : [
		{
			"name" : "temperature",
			"type" : "float",
			"value" : "23"
		},
		{
			"name" : "pressure",
			"type" : "integer",
			"value" : "720"
		}
	]
};

/* GET users listing. */
router.get('/', function(req, res, next) {
	orion.requestEntities().then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/register/:entity', function(req, res, next){
	var e = req.params.entity;
	//console.log('register', e);
	orion.registerContext(e, json).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/delete/:entity', function(req, res, next){
	var e = req.params.entity;
	//console.log('delete', e);
	orion.deleteEntity(e).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

module.exports = router;
