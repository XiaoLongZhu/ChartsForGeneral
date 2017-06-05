var BarChartOverall = {};
BarChartOverall.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		//console.log(source_data);
		BarChartOverall.graphRender(source_data, parameters, div_id);
	});
};

BarChartOverall.graphRender = function(data, parameters, div_id) {

	$(div_id).html("");
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];

	var max_x_val = 0;
	for(var i = 0; i < category.length; i++) {
		var group_i = data[category[i]];
		var count_total = 0;
		for(var j = 0; j < group_i.length; j++) {
			var count = Object.values(group_i[j])[0];
			count_total = count_total + count;
		}
		//console.log(count_total);
		if(max_x_val < count_total) {
			max_x_val = count_total;
		}
	}
	var x_scale = d3.scaleLinear()
		.domain([0, max_x_val])
		.range([0, width - margin.left - margin.right]);

	var y_scale = d3.scaleBand()
		.domain(category)
		.range([0, height - margin.top - margin.bottom])
		.round(true);

	var svg = d3.select(div_id).append("svg")
		.attr("class", "bar_chart_overall")
		.attr("height", height)
		.attr("width", width);

	var svg_axes = svg.append("g").attr("class", "axes");
	var svg_xAxis = d3.axisBottom()
		.scale(x_scale);
	var svg_yAxis = d3.axisLeft()
		.scale(y_scale);
	svg_axes.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(svg_yAxis);

	var svg_rec = svg.append("g").attr("class", "rect_g");
	var colors = d3.schemeCategory10;
	var padding = parameters["bar_width"];
	var min_width_text = parameters["min_width_text"];
	var width_text_factor = parameters["width_text_factor"];
	var width_text_margin = parameters["width_text_margin"];
	for(var i = 0; i < category.length; i++) {
		var group_i = data[category[i]];
		var group_array = [];
		for(var j = 0; j < group_i.length; j++) {
			var count = Object.values(group_i[j])[0];
			group_array.push(count);
		}
		svg_rec.selectAll("rect.bar_" + i)
			.data(group_array)
			.enter()
			.append("rect")
			.attr("class", "bar_" + i)
			.attr("x", function(d, index_i) {
				var start_point = 0;
				for(var k = 0; k < index_i; k++) {
					var bar_length = x_scale(Object.values(group_i[k])[0]);
					start_point = start_point + bar_length;
				}
				return margin.left + start_point;
			})
			.attr("y", function(d) {
				var y_position = y_scale(category[i]);
				return y_position + margin.top + padding;
			})
			.attr("fill", function(d, index_i) {
				var color = colors[index_i % 10];
				return color;
			})
			.attr("width", function(d) {
				return x_scale(d);
			})
			.attr("height", y_scale.bandwidth() - padding * 2);

		svg_rec.selectAll("rect.bar_text_" + i)
			.data(group_array)
			.enter()
			.append("rect")
			.attr("class", "bar_text_" + i)
			.attr("rx", 5)
			.attr("ry", 5)
			.attr("x", function(d, index_i) {
				var start_point = 0;
				for(var k = 0; k < index_i; k++) {
					var bar_length = x_scale(Object.values(group_i[k])[0]);
					start_point = start_point + bar_length;
				}
				return margin.left + start_point + x_scale(d) - min_width_text * width_text_margin;
			})
			.attr("y", function(d) {
				var y_position = y_scale(category[i]);
				return y_position + margin.top + padding * width_text_factor;
			})
			.attr("fill", "#ffffff")
			.attr("style", "stroke-width:1; stroke:#000000")
			.attr("width", function(d) {
				var rect_width = x_scale(d);
				if(rect_width < min_width_text) {
					return 0;
				} else {
					return min_width_text;
				}
			})
			.attr("height", y_scale.bandwidth() - padding * width_text_factor * 2);

		svg_rec.selectAll("text.bar_count_" + i)
			.data(group_array)
			.enter()
			.append("text")
			.attr("class", "bar_count_" + i)
			.attr("x", function(d, index_i) {
				var start_point = 0;
				for(var k = 0; k < index_i; k++) {
					var bar_length = x_scale(Object.values(group_i[k])[0]);
					start_point = start_point + bar_length;
				}
				return margin.left + start_point + x_scale(d) - min_width_text * width_text_margin / 1.5;
			})
			.attr("y", function(d) {
				var y_position = y_scale(category[i]);
				return y_position + margin.top + y_scale.bandwidth() / 2 + padding * width_text_factor;
			})
			.text(function(d, i) {
				return d;
			});

	}

	var if_y_axis = parameters["y_axis"];
	if(if_y_axis != true) {
		$(div_id + " .axis path").hide();
		$(div_id + " .axis .tick line").hide();
	}
};