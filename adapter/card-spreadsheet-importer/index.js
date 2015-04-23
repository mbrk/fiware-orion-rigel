var si = require('../generic/spreadsheet-import.js');
var h = require('../../scripts/helper');
const ENTITY_NAMESPACE = 'CARDNANNY';
const ADAPTER_NAMESPACE = 'MAP';
const ENTITY_SEPARATOR = ':';
const ATTRIBUTE_SEPARATOR = '_';
const ENTITY_TYPE = 'CARDNANNY:MAP:DATA';
var debug = true;

// entities needed by this adapter
var entityDefinition = {
	entities: [
		{
			id:  createEntityKey(['MAP','DATA']),
			type: ENTITY_TYPE,
			attributes: [
				{
					name: createAttributeKey(['DATA']),
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

var allGKZ = ['GKZ08','GKZ09','GKZ11','GKZ12','GKZ04','GKZ02','GKZ06','GKZ13','GKZ03','GKZ05','GKZ07','GKZ10','GKZ14','GKZ15','GKZ01','GKZ16'];

function getRows(callback){
	var data = {};
	var gkzData = {};
	si.getRows().then(
		function(rows){
			for(var r in rows){
				gkzData = {};
				console.log(rows[r]);

				for(var g in allGKZ){
					gkzData[allGKZ[g]] = rows[r][allGKZ[g].toLowerCase()];
				}

				gkzData.label = rows[r].label;
				gkzData.basecolor = rows[r].basecolor;

				data[rows[r].dataset] = gkzData ;

			}


			var update = {
				entity:  createEntityKey(['MAP','DATA']),
				attributes:[
					{
						name: createAttributeKey(['DATA']),
						type: 'integer',
						value: data
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


