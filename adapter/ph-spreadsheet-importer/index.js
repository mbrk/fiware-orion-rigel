var ph = require('./ph-spreadsheet-import.js');
const ENTITY_NAMESPACE = 'DATAFLOW';
const ADAPTER_NAMESPACE = 'HHCARPARK';
const ENTITY_SEPARATOR = ':';
const ATTRIBUTE_SEPARATOR = '_';
const ENTITY_TYPE = 'DATAFLOW:INFRASTRUCTURE:PUBLIC';

// entities needed by this adapter
var entityDefinition = {
	entities: [
		{
			id:  createEntityKey(['CAPACITY','TOTAL']),
			type: ENTITY_TYPE,
			attributes: [
				{
					name: createAttributeKey(['FREE']),
					type: 'integer',
					value: 0
				},
				{
					name:  createAttributeKey(['OCCUPIED']),
					type: 'integer',
					value: 0
				},
				{
					name:  createAttributeKey(['PERCENTAGE', 'FREE']),
					type: 'float',
					value: 0
				},
				{
					name:  createAttributeKey(['PERCENTAGE', 'OCCUPIED']),
					type: 'float',
					value: 0
				},
				{
					name:  createAttributeKey(['HIGHEST']),
					type: 'string',
					value: '-'
				},
				{
					name:  createAttributeKey(['LOWEST']),
					type: 'string',
					value: '-'
				},
				{
					name:  createAttributeKey(['CHANGE']),
					type: 'string',
					value: '-'
				}
			]
		}
	]
};

// interface
module.exports = {
	interval : null,
	init: function(opts) {
		ph.createSheet(opts.key);
	},

	getEntityDefinition: function(){
		return entityDefinition;
	},

	run: function(callback, interval){
		getRows(callback);
		if(interval !== false){
			this.interval = setInterval(function(){getRows(callback)}, interval);
		}
	},

	cleanup: function(){
		if(this.interval) clearInterval(this.interval);
	}
};

/** INTERNAL HELPER **/
// get some work done
function getRows(callback){
	ph.getRows().then(
		function(rows){
			var totalRow = rows[rows.length-1];
			//console.log(totalRow);
			var update = {
				entity:  createEntityKey(['CAPACITY','TOTAL']),
				attributes:[
					{
						name: createAttributeKey(['FREE']),
						type: 'integer',
						value: totalRow.plaetzefrei
					},
					{
						name:  createAttributeKey(['OCCUPIED']),
						type: 'integer',
						value: parseInt(totalRow.plaetzegesamt) - parseInt(totalRow.plaetzefrei)
					},
					{
						name:  createAttributeKey(['PERCENTAGE', 'FREE']),
						type: 'float',
						value: (parseFloat(totalRow.prozentfrei.replace(',', '.')) * 100)
					},
					{
						name:  createAttributeKey(['PERCENTAGE', 'OCCUPIED']),
						type: 'float',
						value: 100 - (parseFloat(totalRow.prozentfrei.replace(',', '.')) * 100)
					},
					{
						name:  createAttributeKey(['HIGHEST']),
						type: 'string',
						value: 'high: ' + new Date().getMilliseconds()
					},
					{
						name:  createAttributeKey(['LOWEST']),
						type: 'string',
						value: 'low: ' + new Date().getMilliseconds()
					},
					{
						name:  createAttributeKey(['CHANGE']),
						type: 'string',
						value: 'change: ' + new Date().getMilliseconds()
					}
				]
			};
			console.log('update: ', new Date().getMilliseconds());

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


