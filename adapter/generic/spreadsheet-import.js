var gsheet= require("google-spreadsheet");
var config = require('../../config/config.js');
var promise = require('promise');

module.exports = {
	sheet: null,
	worksheet: 1,

	createSheet: function(key){
		this.sheet = new gsheet(key);
	},

	getRowCount: function(){
		var sh = this.sheet;
		var ws = this.worksheet;
		return new promise(function(resolve, reject) {
			sh.getRows(ws, function (err, rows) {
				if(err) reject(err);
				resolve(rows.length);
			})
		});
	},

	getRows: function(){
		var sh = this.sheet;
		var ws = this.worksheet;
		return new promise(function(resolve, reject) {
			sh.getRows(ws, function (err, rows) {
				if(err) reject(err);
				resolve(rows);
			})
		});
	}
};
