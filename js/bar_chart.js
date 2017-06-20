/*
 *********************************************************
 ######################
 This is the source code for Bar Chart
 Most of the key elements are located within
 the function "graphRender".
 The function "initGraph" is just used to
 retrieve the data needed, which is based on the 
 function "$.getJSON()" from jQuery.
 Feel free to modify this in order to fit your needs.
 ######################
 *********************************************************
 */

var BarChart = {}; // namespace for bar chart

/*
This function is used to retrieve the data.
Parameters needed:
1. data: Data source where you want to retrieve data. It could
be a json file or a link.
2. parameters: Configurations for bar chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
bar chart.
 */
BarChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		/*
		 When you invoke this function, source_data will
		 be the data retrieved.
		 Then the function "graphRender" will create bar
		 chart basing on this.
		 */
		BarChart.graphRender(source_data, parameters, div_id);
	});
};

/*
This function is used to create the bar chart.
1. data: The data retrieved. See details about format in bar_chart.json
2. parameters: Configurations for bar chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
bar chart.
 */
BarChart.graphRender = function(data, parameters, div_id) {

	$(div_id).html(""); // Before creating, clean the div block
	/*
	 These are some parameters configured in general.js
	 */
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];

	/*
	 ####################
	 This part of code tries to get the categories needed
	 which will be used in x-axis.
	 */
	var category_name = category[0];
	var category_data = data[category_name];
	var category_x_array = []; // This array will contain the categories in x-axis
	// This loop is to put categories into that array
	for(var i = 0; i < category_data.length; i++) {
		var x_element = Object.keys(category_data[i])[0];
		category_x_array.push(x_element);
	}
	//console.log(category_x_array);
	/*
	 ####################
	 */

	/*
	 Construct a scale for x-axis
	 */
	var x_scale = d3.scaleBand()
		.domain(category_x_array)
		.range([0, width - margin.left - margin.right])
		.round(true);

	/*
	 ####################
	 This part of code tries to get all values needed
	 which will be used in y-axis.
	 */
	var category_count = category.length;
	var category_y_array = []; // This array will contain all values
	for(var i = 0; i < category_count; i++) {
		var category_name = category[i];
		var category_data = data[category_name];
		for(var j = 0; j < category_data.length; j++) {
			var y_element = category_data[j][Object.keys(category_data[j])[0]];
			category_y_array.push(y_element);
		}
		//console.log(category_y_array);
	}
	/*
	 ####################
	*/

	//Calculate the max value from that array for y-axis
	//Here we round the max value from that array to the ceiling
	//For example, if the max is 45, then we say the max value for y-axis
	//is 50; if 53, then the max value for y-axis is 60.
	var category_y_max = Math.ceil(Math.max.apply(null, category_y_array) / 10) * 10;

	/*
	 Construct a scale for y-axis
	*/
	var y_scale = d3.scaleLinear()
		.domain([0, category_y_max])
		//Be careful about the range here
		//Since the y-axis will be drawn from top to bottom,
		//meaning values from small to large.
		//So we need the range to be from large to small,
		//then bars can be created correctly.
		.range([height - margin.top - margin.bottom, 0]);

	//Initialize an empty svg block
	var svg = d3.select(div_id).append("svg")
		.attr("class", "bar_chart")
		.attr("height", height) //Define height
		.attr("width", width); //Define width

	/*
	  ################################
	  Initialize x-axis and y-axis
	*/
	var svg_axes = svg.append("g").attr("class", "axes");
	var svg_xAxis = d3.axisBottom()
		.scale(x_scale);
	var svg_yAxis = d3.axisLeft()
		.scale(y_scale);
	svg_axes.append("g")
		.attr("class", "x_axis")
		//Define the starting position for x-axis
		.attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
		.call(svg_xAxis);
	svg_axes.append("g")
		.attr("class", "y_axis")
		//Define the starting position for y-axis
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(svg_yAxis);
	/*
	  ################################
	*/

	/*
	 ####################
	 This part of code tries to initialize grid lines
	*/
	var if_grid_lines = parameters["grid_lines"];
	if(if_grid_lines == true) {
		// add the Y gridlines
		svg_axes.append("g")
			.attr("class", "grid_lines")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(svg_yAxis
				//By default, D3 will create a small tick line
				//on the left side of y-axis, meaning that is the tick
				//for each value.
				//If we set the tick size(or we can say length) to be
				//the same as x-axis, then we can get grid lines
				.tickSize(-(width - margin.left - margin.right))
				.tickFormat("")
			);
		// Define the style for grid lines	
		svg_axes.selectAll(".grid_lines .tick line")
			.attr("style", "stroke-width:1; stroke:#808080; opacity: 0.5");
		$(div_id + " .grid_lines path").hide();
	}
	/*
	 ####################
	*/

	//This array contains 10 different colors,
	//each element is like "#xxxxxx", which is color code
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
					(x_scale.bandwidth() / category_count - padding * 2) * i;
				var offset_text = (x_scale.bandwidth() / category_count - padding * 2) / 2 - 6;
				return x_value + offset_text;
			})
			.attr("y", function(d) {
				var y_value = Object.values(d)[0];
				return margin.top + y_scale(y_value) - 10;
			})
			.attr("font-size", "10px")
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

	var if_title = parameters["if_title"];
	if(if_title == true) {
		var title = parameters["title"];
		var title_font = parameters["title_font"];
		var title_left = parameters["title_left"];
		svg.append("text")
			.attr("class", "bar_chart_title")
			.attr("x", title_left)
			.attr("y", (margin.top - title_font.substring(0, 2)) / 2)
			.attr("style", "font-size:" + title_font)
			.text(title);
	}

};