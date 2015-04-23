var si = require('../generic/spreadsheet-import.js');
var h = require('../../scripts/helper');
const ENTITY_NAMESPACE = 'SENSORHOME';
const ADAPTER_NAMESPACE = 'WEATHER';
const ENTITY_SEPARATOR = ':';
const ATTRIBUTE_SEPARATOR = '_';
const ENTITY_TYPE = 'SENSORHOME:PERSONAL:INFO';
var debug = true;

// entities needed by this adapter
var entityDefinition = {
	entities: [
		{
			id:  createEntityKey(['MY','WEATHER']),
			type: ENTITY_TYPE,
			attributes: [
				{
					name: createAttributeKey(['WEATHER']),
					type: 'string',
					value: "-"
				}
			]
		}
	]
};

module.exports = {

	interval : null,
	init: function(opts) {
		si.createSheet(opts.key);
	},

	getEntityDefinition: function(){
		return entityDefinition;
	},

	run: function(callback, interval){
		if(debug) console.log('run: ', ADAPTER_NAMESPACE);
		getRows(callback);
		if(interval !== false){
			this.interval = setInterval(function(){getRows(callback)}, interval);
		}
	},

	cleanup: function(){
		if(this.interval) clearInterval(this.interval);
	}
};



function getRows(callback){
	var weather = [];
	si.getRows().then(
		function(rows){
			var entry = [];
			for(var r in rows){
				if(rows[r].label == "BREAK"){
					weather.push(entry);
					entry = [];
				}else{
					entry.push([rows[r].label, rows[r].value]);
				}
			}
			weather.push(entry);



			var update = {
				entity:  createEntityKey(['MY','WEATHER']),
				attributes:[
					{
						name: createAttributeKey(['WEATHER']),
						type: 'integer',
						value: weather
					}
				]
			};

			callback(update);
		},
		function(error){
			console.log(error);
		}
	);
}

function createEntityKey(parts){
	return (ENTITY_NAMESPACE + ENTITY_SEPARATOR + ADAPTER_NAMESPACE + ENTITY_SEPARATOR + parts.join(ENTITY_SEPARATOR)).toUpperCase();
}

function createAttributeKey(parts){
	return (parts.join(ATTRIBUTE_SEPARATOR)).toLowerCase();
}


