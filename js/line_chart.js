/*
 *********************************************************
 ######################
 This is the source code for Line Chart
 Most of the key elements are located within
 the function "graphRender".
 The function "initGraph" is just used to
 retrieve the data needed, which is based on the 
 function "$.getJSON()" from jQuery.
 Feel free to modify this in order to fit your needs.
 ######################
 *********************************************************
 */

var LineChart = {}; // namespace for line chart

/*
This function is used to retrieve the data.
Parameters needed:
1. data: Data source where you want to retrieve data. It could
be a json file or a link.
2. parameters: Configurations for line chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
line chart.
*/
LineChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		/*
		 When you invoke this function, source_data will
		 be the data retrieved.
		 Then the function "graphRender" will create line
		 chart basing on this.
		*/
		LineChart.graphRender(source_data, parameters, div_id);
	});
};

/*
This function is used to create the line chart.
Parameters needed:
1. data: The data retrieved. See details about format in line_chart.json
2. parameters: Configurations for line chart. See details in general.js
3. div_id: The div block in your html file where you want to put this
line chart.
*/
LineChart.graphRender = function(data, parameters, div_id) {

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
	var x_array = []; // This array will contain the categories
	//use double loop to go through data in order to get categories
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		for(var j = 0; j < current_cate.length; j++) {
			var x_element = Object.keys(current_cate[j])[0];
			//if current category is not in that array, add it
			if(x_array.indexOf(x_element) == -1) {
				x_array.push(x_element);
			}
		}
	}
	//console.log(x_array);
	/*
	 ####################
	*/

	/*
	 Construct a scale for x-axis
	*/
	var padding = parameters["padding"];
	var x_scale = d3.scalePoint()
		.domain(x_array)
		.range([0, width - margin.left - margin.right])
		.padding(padding)
		.round(true);

	/*
	 ####################
	 This part of code tries to get the max value from data
	 which will be used in y-axis.
	*/
	var y_max = 0; //initialize this to be 0
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		for(var j = 0; j < current_cate.length; j++) {
			var y_element = Object.values(current_cate[j])[0];
			if(y_element > y_max) {
				//if current value is bigger than the max
				//change the max to be current value
				y_max = y_element;
			}
		}
	}
	//console.log(y_max);
	/*
	 ####################
	*/

	//Calculate the max value from that array for y-axis
	//Here we round the max value from that array to the ceiling
	//For example, if the max is 45, then we say the max value for y-axis
	//is 50; if 53, then the max value for y-axis is 60.
	var category_y_max = Math.ceil(y_max / 10) * 10;

	/*
	 Construct a scale for y-axis
	*/
	var y_scale = d3.scaleLinear()
		.domain([0, category_y_max])
		//Be careful about the range here
		//Since the y-axis will be drawn from top to bottom,
		//meaning values from small to large.
		//So we need the range to be from large to small,
		//then lines can be created correctly.
		.range([height - margin.top - margin.bottom, 0]);

	//Initialize an empty svg block
	var svg = d3.select(div_id).append("svg")
		.attr("class", "line_chart")
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
		.attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
		.call(svg_xAxis);
	svg_axes.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(svg_yAxis);
	/*
	  ################################
	*/

	// show or hide the y_axis line
	var if_y_axis = parameters["y_axis"];
	if(if_y_axis != true) {
		$(div_id + " .y_axis path").hide();
		$(div_id + " .y_axis .tick line").hide();
	}
	// show or hide the x_axis line
	var if_x_axis = parameters["x_axis"];
	if(if_x_axis != true) {
		$(div_id + " .x_axis path").hide();
		$(div_id + " .x_axis .tick line").hide();
	}

	/*
	 ####################
	 This part of code tries to initialize grid lines
	*/
	var if_grid_lines = parameters["grid_lines"];
	if(if_grid_lines == true) {
		//add the Y gridlines
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
			.attr("style", "stroke-width:1; stroke:#808080; opacity: 0.5;");
		$(div_id + " .grid_lines path").hide();
	}
	/*
	 ####################
	*/

	//This array contains 10 different colors,
	//each element is like "#xxxxxx", which is color code
	var colors = d3.schemeCategory10; //It's an array

	//define a function for lines
	//first this function will draw all points needed
	//according to data, then connect all points together
	//to become a line
	var graph_line = d3.line()
		//define attribute x for a point 
		.x(function(d) {
			//console.log(x_scale(Object.keys(d)[0]));
			return x_scale(Object.keys(d)[0]) + margin.left;
		})
		//define attribute y for a point
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

	//show or hide the title
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