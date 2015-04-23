var ical = require('ical');
var h = require('../../scripts/helper');
const ENTITY_NAMESPACE = 'SENSORHOME';
const ADAPTER_NAMESPACE = 'CALENDAR';
const ENTITY_SEPARATOR = ':';
const ATTRIBUTE_SEPARATOR = '_';
const ENTITY_TYPE = 'SENSORHOME:PERSONAL:INFO';
var debug = true;

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// entities needed by this adapter
var entityDefinition = {
	entities: [
		{
			id:  createEntityKey(['MY','EVENTS']),
			type: ENTITY_TYPE,
			attributes: [
				{
					name: createAttributeKey(['EVENTS']),
					type: 'string',
					value: "-"
				}
			]
		}
	]
};

module.exports = {

	calendarUrl: null,
	interval: null,
	init: function(icalUrl){
		this.calendarUrl = icalUrl;
	},
	getEntityDefinition: function(){
		return entityDefinition;
	},
	run: function(callback, interval){
		if(debug) console.log('run: ', ADAPTER_NAMESPACE);
		var url = this.calendarUrl;
		getCalendar(url, callback);
		if(interval !== false){
			this.interval = setInterval(function(){getCalendar(url, callback)}, interval);
		}

	},
	cleanup: function(){
		if(this.interval) clearInterval(this.interval);
	}
};

function getCalendar(calendarUrl, callback){
	var events = [];
	var e, ev;
	var update = {};
	ical.fromURL(calendarUrl, {}, function(err, data) {
		for (var k in data){
			if (data.hasOwnProperty(k)) {
				ev = data[k];
				e = {
					summary: ev.summary,
					start:{
						ts: ev.start,
						day: format(ev.start.getDate()) + '.'+  months[ev.start.getMonth()] + '.' + ev.start.getFullYear(),
						time: format(ev.start.getHours()) + ':' + format(ev.start.getMinutes())
					},
					end: {
						ts: ev.end,
						day: format(ev.end.getDate()) + '.'+  months[ev.end.getMonth()] + '.' + ev.end.getFullYear(),
						time: format(ev.end.getHours()) + ':' + format(ev.end.getMinutes())
					},
					location: ev.location
				};

				events.push(e);

				/*console.log(ev);
				console.log("-----------");
				console.log(e);*/
			}

		}
		update = {
			entity:  createEntityKey(['MY','EVENTS']),
			attributes:[
				{
					name: createAttributeKey(['EVENTS']),
					type: 'string',
					value: events
				}
			]
		};
		callback(update);

	});
}

function format(nr){
	return (String(nr).length < 2) ? padLeft(nr, 1) : nr;
}

function padLeft(nr, n, str){
	return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function createEntityKey(parts){
	return (ENTITY_NAMESPACE + ENTITY_SEPARATOR + ADAPTER_NAMESPACE + ENTITY_SEPARATOR + parts.join(ENTITY_SEPARATOR)).toUpperCase();
}

function createAttributeKey(parts){
	return (parts.join(ATTRIBUTE_SEPARATOR)).toLowerCase();
}


