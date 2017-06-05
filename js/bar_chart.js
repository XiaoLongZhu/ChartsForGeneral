var BarChart = {};
BarChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		//console.log(source_data);
		//console.log(parameters);
		//console.log(div_id);
		BarChart.graphRender(source_data, parameters, div_id);
	});
};

BarChart.graphRender = function(data, parameters, div_id) {

	$(div_id).html("");
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];

	//var x_scale = [];
	//var category_count = category.length;
	//for(var i = 0; i < category_count; i++) {
	var category_name = category[0];
	var category_data = data[category_name];
	var category_x_array = [];
	for(var i = 0; i < category_data.length; i++) {
		var x_element = Object.keys(category_data[i])[0];
		category_x_array.push(x_element);
		//console.log(x_element);
	}
	//console.log(category_x_array);
	var x_scale = d3.scaleBand()
		.domain(category_x_array)
		.range([0, width - margin.left - margin.right])
		.round(true);
	//}

	var category_count = category.length;
	var category_y_array = [];
	for(var i = 0; i < category_count; i++) {
		var category_name = category[i];
		var category_data = data[category_name];
		for(var j = 0; j < category_data.length; j++) {
			var y_element = category_data[j][Object.keys(category_data[j])[0]];
			category_y_array.push(y_element);
			//console.log(Object.keys(category_data[j])[0]);
		}
		//console.log(category_y_array);
	}
	var category_y_max = Math.ceil(Math.max.apply(null, category_y_array) / 10) * 10;
	var y_scale = d3.scaleLinear()
		.domain([0, category_y_max])
		.range([height - margin.top - margin.bottom, 0]);

	var svg = d3.select(div_id).append("svg")
		.attr("class", "bar_chart")
		.attr("height", height)
		.attr("width", width);

	var svg_axes = svg.append("g").attr("class", "axes");
	var svg_xAxis = d3.axisBottom()
		.scale(x_scale);
	var svg_yAxis = d3.axisLeft()
		.scale(y_scale);
	svg_axes.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
		.call(svg_xAxis);
	svg_axes.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(svg_yAxis);

	var if_grid_lines = parameters["grid_lines"];
	if(if_grid_lines == true) {
		//add the Y gridlines
		svg_axes.append("g")
			.attr("class", "grid_lines")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(svg_yAxis
				.tickSize(-(width - margin.left - margin.right))
				.tickFormat("")
			);
		svg_axes.selectAll(".grid_lines .tick line")
			.attr("style", "stroke-width:1; stroke:#808080; opacity: 0.5;");
		$(div_id + " .grid_lines path").hide();
	}

	var colors = d3.schemeCategory10;
	var padding = parameters["bar_width"];
	for(var i = 0; i < category_count; i++) {
		var category_name = category[i];
		//console.log(category_name);
		var category_data = data[category_name];
		//console.log(colors[i]);

		svg.selectAll("rect.bar_" + i)
			.data(category_data)
			.enter()
			.append("rect")
			.attr("class", "bar_" + i)
			.attr("x", function(d) {
				var x_name = Object.keys(d)[0];
				return x_scale(x_name) + margin.left + padding * category_count + (x_scale.bandwidth() / category_count - padding * 2) * i;
			})
			.attr("y", function(d) {
				var y_value = Object.values(d)[0];
				return margin.top + y_scale(y_value);
			})
			.attr("width", x_scale.bandwidth() / category_count - padding * 2)
			.attr("fill", function(d, j) {
				var color = colors[i];
				return color;
			})
			.attr("height", function(d) {
				var y_value = Object.values(d)[0];
				return height - margin.top - margin.bottom - y_scale(y_value);
			});

		svg.selectAll("text.bar_count_" + i)
			.data(category_data)
			.enter()
			.append("text")
			.attr("class", "bar_count_" + i)
			.attr("x", function(d) {
				var x_name = Object.keys(d)[0];
				var x_value = x_scale(x_name) +
					margin.left +
					padding * category_count +
					((x_scale.bandwidth() / category_count) / 6) +
					(x_scale.bandwidth() / category_count - padding * 2) * i;
				return x_value;
			})
			.attr("y", function(d) {
				var y_value = Object.values(d)[0];
				return margin.top / 2 + y_scale(y_value);
			})
			.text(function(d, i) {
				var y_value = Object.values(d)[0];
				return y_value;
			});

	}

	var if_y_axis = parameters["y_axis"];
	if(if_y_axis != true) {
		$(div_id + " .y_axis path").hide();
		$(div_id + " .y_axis .tick line").hide();
	}
	var if_x_axis = parameters["x_axis"];
	if(if_x_axis != true) {
		$(div_id + " .x_axis path").hide();
		$(div_id + " .x_axis .tick line").hide();
	}
};