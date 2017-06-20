/*
 *********************************************************
 ######################
 This is the source code for Pie Chart
 Most of the key elements are located within
 the function "graphRender".
 The function "initGraph" is just used to
 retrieve the data needed, which is based on the 
 function "$.getJSON()" from jQuery.
 Feel free to modify this in order to fit your needs.
 ######################
 *********************************************************
*/

var PieChart = {}; //Namespace for pie chart

/*
This function is used to retrieve the data.
Parameters needed:
1. data: Data source where you want to retrieve data. It could
be a json file or a link.
2. parameters: Configurations for pie chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
pie chart.
*/
PieChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		/*
		 When you invoke this function, source_data will
		 be the data retrieved.
		 Then the function "graphRender" will create pie
		 chart basing on this.
		*/
		PieChart.graphRender(source_data, parameters, div_id);

	});
};

/*
This function is used to create the pie chart.
Parameters needed:
1. data: The data retrieved. See details about format in bar_chart.json
since the pie chart uses the same data format as the bar chart
2. parameters: Configurations for pie chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
pie chart.
*/
PieChart.graphRender = function(data, parameters, div_id) {

	$(div_id).html(""); // Before creating, clean the div block
	/*
	 These are some parameters configured in general.js
	 */
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var radius = parameters["radius"];
	var inner_radius = parameters["inner_radius"];
	var category = parameters["category"];
	//This array contains 20 different colors,
	//each element is like "#xxxxxx", which is color code
	var colors = d3.schemeCategory20; //It's an array

	var category_data_total = [];
	var category_init = data[category[0]];
	for(var i = 0; i < category_init.length; i++) {
		var class_name = Object.keys(category_init[i])[0];
		var element_total = {};
		element_total[class_name] = 0;
		category_data_total.push(element_total);
	}

	for(var i = 0; i < category.length; i++) {
		var category_name = category[i];
		var category_data = data[category_name];
		var category_count = category_data.length;
		for(var j = 0; j < category_count; j++) {
			var class_name = Object.keys(category_data[j])[0];
			for(var k = 0; k < category_data_total.length; k++) {
				var element_total = category_data_total[k];
				var element_name_total = Object.keys(element_total)[0];
				if(element_name_total == class_name) {
					var class_value = Object.values(category_data[j])[0];
					element_total[element_name_total] = element_total[element_name_total] + class_value;
				}
			}
		}
	}

	var value_total = 0;
	for(var i = 0; i < category_data_total.length; i++) {
		var element_value = Object.values(category_data_total[i])[0];
		value_total = value_total + element_value;
	}
	//console.log(category_data_total);
	//console.log(value_total);

	var svg = d3.select(div_id).append("svg")
		.attr("class", "pie_chart")
		.attr("height", height)
		.attr("width", width);

	var pie_function = d3.pie()
		.sort(function(d) {
			return Object.keys(d)[0];
		})
		.value(function(d) {
			return Object.values(d)[0];
		});
	var arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(inner_radius);

	var pie_body = svg.append("g")
		.attr("class", "pie")
		.attr("transform", "translate(" +
			(radius + margin.left) +
			"," +
			(radius + margin.top) + ")");

	var pie_slices = pie_body.append("g")
		.attr("class", "slices_g");
	var slices = pie_slices.selectAll("path.arc")
		.data(pie_function(category_data_total))
		.enter()
		.append("path")
		.attr("class", "arc")
		.attr("fill", function(d, i) {
			//console.log(d);
			return colors[i % 20];
		});
	slices.transition()
		.attrTween("d", function(d) {
			var currentArc = this.__current__;

			if(!currentArc)
				currentArc = {
					startAngle: 0,
					endAngle: 0
				};

			var interpolate = d3.interpolate(
				currentArc, d);

			this.__current__ = interpolate(1);

			return function(t) {
				return arc(interpolate(t));
			};
		});

	var detailsG = pie_body.append("g")
		.attr("class", "details_g");
	var details_info = detailsG.selectAll("text.details_info")
		.data(pie_function(category_data_total))
		.enter()
		.append("text")
		.attr("class", "details_info")
		.attr("x", function(d, i) {
			//console.log(arc.centroid(d));
			return arc.centroid(d)[0];
		})
		.attr("y", function(d, i) {
			return arc.centroid(d)[1];
		})
		.attr("text-anchor", "middle")
		.attr("style", "fill:#ffffff;font-size:10px")
		.text(function(d, i) {
			//console.log(d);
			var percentage_num = (d.value / value_total) * 100;
			var percentage_string = percentage_num.toString();
			var end = percentage_string.indexOf(".") + 3;
			//console.log(percentage * 100);
			return percentage_string.substring(0, end) + "%";
		});

	var if_title = parameters["if_title"];
	if(if_title == true) {
		var title = parameters["title"];
		var title_font = parameters["title_font"];
		var title_left = parameters["title_left"];
		svg.append("text")
			.attr("class", "pie_chart_title")
			.attr("x", title_left)
			.attr("y", (margin.top - title_font.substring(0, 2)) / 2)
			.attr("style", "font-size:" + title_font)
			.text(title);
	}

	var if_legend = parameters["if_legend"];
	if(if_legend == true) {
		var legend_left = parameters["legend_left"];
		svg.selectAll("rect.legend")
			.data(category_data_total)
			.enter()
			.append("rect")
			.attr("class", "legend")
			.attr("x", margin.left + radius * 2 + legend_left)
			.attr("y", function(d, i) {
				var offset_top = (height - 20 * category_data_total.length) / 2;
				return i * 20 + offset_top;
			})
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", function(d, i) {
				return colors[i % 20];
			});
		svg.selectAll("text.legend_text")
			.data(category_data_total)
			.enter()
			.append("text")
			.attr("class", "legend_text")
			.attr("x", margin.left + radius * 2 + legend_left + 20)
			.attr("y", function(d, i) {
				var offset_top = (height - 20 * category_data_total.length) / 2;
				return i * 20 + offset_top + 8;
			})
			.attr("font-size", "10px")
			.text(function(d) {
				var legend_text = Object.keys(d)[0];
				return legend_text;
			});
	}

};