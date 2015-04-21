var orionClient = require('fiware-orion-mintaka');
var disabled = true;

module.exports = {

	init: function(conf){
		orionClient.configure(conf);
	},

	initEntities: function(definition){

		definition.entities.map(function(ent){

			var attrObj = {
				attributes: ent.attributes
			};
			if(disabled) return;
			orionClient.registerEntityWithType(ent.id, ent.type, attrObj).then(
				function(success){
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
		orionClient.updateAttributes(update.entity, attrObj);
	}

};
