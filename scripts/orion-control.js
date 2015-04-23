var orionClient = require('fiware-orion-mintaka');
var h = require('./helper');
var disabled = false;

module.exports = {

	init: function(conf){
		orionClient.configure(conf);
	},

	initEntities: function(definition){
		if(disabled) return;
		definition.entities.map(function(ent){

			var attrObj = {
				attributes: ent.attributes
			};

			h.deepLog(attrObj, ent.id + ' - init to send');
			orionClient.registerEntityWithType(ent.id, ent.type, attrObj).then(
				function(success){
					h.deepLog(success, ent.id + " - orion response");
					console.log("entity registered", ent.id);
				},
				function(error){
					console.log("error registering entity", ent.id);
				}
			);
		});
	},

	updateEntities: function(update){
		if(disabled) return;
		var attrObj = {
			attributes: update.attributes
		};

		h.deepLog(attrObj, update.entity + ' - update to send');
		orionClient.updateAttributes(update.entity, attrObj);
	}

};
