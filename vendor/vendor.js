/* exported vendor */

/* Magic Mirror
 * Vendor File Definition
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var vendor = {
	"moment.js" : "node_modules/moment/min/moment-with-locales.src",
	"moment-timezone.js" : "node_modules/moment-timezone/builds/moment-timezone-with-data.src",
	"weather-icons.css": "node_modules/weathericons/css/weather-icons.css",
	"weather-icons-wind.css": "node_modules/weathericons/css/weather-icons-wind.css",
	"font-awesome.css": "css/font-awesome.css",
	"nunjucks.js": "node_modules/nunjucks/browser/nunjucks.min.src",
	"suncalc.js": "node_modules/suncalc/suncalc.src"
};

if (typeof module !== "undefined"){module.exports = vendor;}
