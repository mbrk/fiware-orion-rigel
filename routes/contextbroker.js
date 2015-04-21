/**
 * routes for controlling the context broker - mostly for feedback/control in development
 */

var express = require('express');
var router = express.Router();
var config = require('../config/config.js');

var orion = require('fiware-orion-mintaka');
orion.configure(config.ORION);

var json = {"attributes":[{"name":"free","type":"integer","value":0},{"name":"occupied","type":"integer","value":0},{"name":"percentage_free","type":"float","value":0},{"name":"percentage_occupied","type":"float","value":0},{"name":"highest","type":"string","value":"-"},{"name":"lowest","type":"string","value":"-"},{"name":"change","type":"string","value":"-"}]};

/* GET listing. */
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

router.get('/register/:type/entity/:entity',function(req, res, next){
	var e = req.params.entity;
	var t = req.params.type;
	//console.log('register', e);
	orion.registerEntityWithType(e, t, json).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/register/:entity/attribute/:attribute', function(req, res, next){
	var e = req.params.entity;
	var a = req.params.attribute;
	orion.registerAttribute(e, a, 34).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/:entity/attributes',function(req, res, next){
	var e = req.params.entity;
	orion.queryAttributes(e).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/:entity/attributes/:attribute',function(req, res, next){
	var e = req.params.entity;
	var a = req.params.attribute;
	orion.querySingleAttribute(e, a).then(
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
	orion.registerEntity(e, json).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/type/:type', function(req, res, next){
	var t = req.params.type;
	orion.queryEntitiesByType(t).then(
		function(success){
			res.send(success);
		},
		function(error){
			res.send(error);
		}
	);
});

router.get('/type/:type/attribute/:attribute',function(req, res, next){
	var t = req.params.type;
	var a = req.params.attribute;
	orion.querySingleAttributeByEntityType(t, a).then(
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
