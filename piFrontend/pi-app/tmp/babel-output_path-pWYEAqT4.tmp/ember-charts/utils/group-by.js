define("ember-charts/utils/group-by", ["exports"], function (exports) {
	"use strict";

	exports.groupBy = groupBy;

	function groupBy(obj, getter) {
		var group, key, value;
		var result = {};
		for (var i = 0, len = obj.length; i < len; i++) {
			value = obj[i];
			key = getter(value, i);
			group = result[key] || (result[key] = []);
			group.push(value);
		}
		return result;
	}
});