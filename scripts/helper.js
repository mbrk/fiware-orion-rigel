var util = require('util');

exports.deepLog = function(json){
	console.log(util.inspect(json, false, null));
}
