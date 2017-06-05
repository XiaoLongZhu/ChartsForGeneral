var LineChart = {};
LineChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		LineChart.graphRender(source_data, parameters, div_id);
	});
};

LineChart.graphRender = function(data, parameters, div_id) {
	console.log(data);
	$(div_id).html("");
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];
	
};