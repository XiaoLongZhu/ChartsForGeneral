var LineChart = {};
LineChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		LineChart.graphRender(source_data, parameters, div_id);
	});
};

LineChart.graphRender = function(data, parameters, div_id) {

	//console.log(data);
	$(div_id).html("");
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];

	var x_array = [];
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		//console.log(current_cate);
		for(var j = 0; j < current_cate.length; j++) {
			var x_element = Object.keys(current_cate[j])[0];
			//console.log(x_element);
			if(x_array.indexOf(x_element) == -1) {
				x_array.push(x_element);
			}
		}
	}
	//console.log(x_array);
	var padding = parameters["padding"];
	var x_scale = d3.scalePoint()
		.domain(x_array)
		.range([0, width - margin.left - margin.right])
		.padding(padding)
		.round(true);

	var y_max = 0;
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		//console.log(current_cate);
		for(var j = 0; j < current_cate.length; j++) {
			var y_element = Object.values(current_cate[j])[0];
			//console.log(x_element);
			if(y_element > y_max) {
				y_max = y_element;
			}
		}
	}
	//console.log(y_max);
	var category_y_max = Math.ceil(y_max / 10) * 10;
	var y_scale = d3.scaleLinear()
		.domain([0, category_y_max])
		.range([height - margin.top - margin.bottom, 0]);

	var svg = d3.select(div_id).append("svg")
		.attr("class", "line_chart")
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

	var graph_line = d3.line()
		.x(function(d) {
			//console.log(x_scale(Object.keys(d)[0]));
			return x_scale(Object.keys(d)[0]) + margin.left;
		})
		.y(function(d) {
			//console.log(y_scale(Object.values(d)[0]));
			return y_scale(Object.values(d)[0]) + margin.top;
		});

	var line_width = parameters["line_width"];
	var text_offset_x = parameters["text_offset_x"];
	var text_offset_y = parameters["text_offset_y"];
	var text_box_width = parameters["text_box_width"];
	var text_box_height = parameters["text_box_height"];
	var line_group = svg.append("g")
		.attr("class", "line_g");
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		line_group.selectAll("path.line_" + i)
			.data([current_cate])
			.enter()
			.append("path")
			.attr("class", "line_" + i)
			.attr("fill", "none")
			.attr("style", "stroke-width:" + line_width + "; stroke:" + colors[i])
			.attr("stroke-linecap", "round")
			.attr("d", graph_line);

		line_group.selectAll("rect.line_text_" + i)
			.data(current_cate)
			.enter()
			.append("rect")
			.attr("class", "line_text_" + i)
			.attr("rx", 5)
			.attr("ry", 5)
			.attr("x", function(d) {
				var x_name = Object.keys(d)[0];
				var x_value = x_scale(x_name);
				return x_value + margin.left - text_offset_x;
			})
			.attr("y", function(d) {
				var y_value = Object.values(d)[0];
				return margin.top + y_scale(y_value) - text_offset_y;
			})
			.attr("fill", "#ffffff")
			.attr("style", "stroke-width:1; stroke:#808080;")
			.attr("width", text_box_width)
			.attr("height", text_box_height);

		line_group.selectAll("text.line_count_" + i)
			.data(current_cate)
			.enter()
			.append("text")
			.attr("class", "line_count_" + i)
			.attr("x", function(d) {
				var x_name = Object.keys(d)[0];
				var x_value = x_scale(x_name);
				var offset = text_box_width / 2 - 5;
				return x_value + margin.left + offset - text_offset_x;
			})
			.attr("y", function(d) {
				var y_value = Object.values(d)[0];
				var offset = text_box_height / 2 + 5;
				return margin.top + y_scale(y_value) - text_offset_y + offset;
			})
			.attr("font-size", "10px")
			.text(function(d) {
				var y_value = Object.values(d)[0];
				return y_value;
			});

	}

	var if_title = parameters["if_title"];
	if(if_title == true) {
		var title = parameters["title"];
		var title_font = parameters["title_font"];
		var title_left = parameters["title_left"];
		svg.append("text")
			.attr("class", "line_chart_title")
			.attr("x", title_left)
			.attr("y", (margin.top - title_font.substring(0, 2)) / 2)
			.attr("style", "font-size:" + title_font)
			.text(title);
	}

};