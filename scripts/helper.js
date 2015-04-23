var util = require('util');

exports.deepLog = function(json, label){
	if(label){
		console.log();
		console.log(label);
		console.log("----------------");
	}

	console.log(util.inspect(json, false, null));
	console.log("----------------");
	console.log();
}
