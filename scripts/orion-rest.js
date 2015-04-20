var rest = require('restler');
var promise = require('promise');
var config = require('./config.js');
var h = require('./helper.js');

var options = {
	username: config.ORION.user,
	password: config.ORION.pass,
	rejectUnauthorized: false,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'User-Agent': 'Restler for node.js'
	}
};

var brokerUrl = config.ORION.protocol + '://' + config.ORION.user + ':' + config.ORION.pass + '@' + config.ORION.url;

function registerContext(entity, json){
	var url = brokerUrl + 'contextEntities/' + entity;
	console.log('registercontext', url);
	return new promise(function(resolve, reject){
		rest.postJson(url, json, options)
			.on('success', function(data, response) {
				//console.log('#### SUCCESS ####');
				//h.deepLog(data);
				resolve(data);
			})
			.on('fail', function(data, response) {
				console.log('#### FAIL ####');
				//h.deepLog(data);
				reject(data);
			});
	});
}

function requestEntities(){
	var url = brokerUrl + 'contextEntities';
	console.log('requestEntities', url);
	return new promise(function(resolve, reject){
		rest.get(url, options)
			.on('success', function(data, response) {
				//console.log('#### SUCCESS ####');
				//h.deepLog(data);
				resolve(data);
			})
			.on('fail', function(data, response) {
				console.log('#### FAIL ####');
				//h.deepLog(data);
				reject(data);
			});
	});
}

function deleteEntity(entity){
	var url = brokerUrl + 'contextEntities/' + entity;
	console.log('deleteentity', url);
	return new promise(function(resolve, reject){
		rest.del(url, options)
			.on('success', function(data, response) {
				/*console.log('#### SUCCESS ####');
				h.deepLog(data);*/
				resolve(data);
			})
			.on('fail', function(data, response) {
				console.log('#### FAIL ####');
				//h.deepLog(data);
				reject(data);
			});
	});

}

exports.requestEntities = requestEntities;
exports.registerContext = registerContext;
exports.deleteEntity = deleteEntity;
