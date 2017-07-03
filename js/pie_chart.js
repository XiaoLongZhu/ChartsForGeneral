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

	/*
	 ####################
	 This part of code tries to get the categories needed
	 which will be used in the legend. Then accumulate
	 values for each category according to the combination
	 configured in general.js
	 */
	//This is the array containing all information
	//for the pie chart
	var category_data_total = [];
	var category_init = data[category[0]];
	//This loop initializes names for all categories and 
	//set the value to be 0 for each
	for(var i = 0; i < category_init.length; i++) {
		var class_name = Object.keys(category_init[i])[0]; // get the name for this category
		var element_total = {};
		element_total[class_name] = 0; //initialize and set the value to be 0
		category_data_total.push(element_total);
	}

	//This loop tries to accumulate values
	for(var i = 0; i < category.length; i++) {
		var category_name = category[i]; //get the name for category first
		var category_data = data[category_name]; //get data for this category
		var category_count = category_data.length;
		for(var j = 0; j < category_count; j++) {
			var class_name = Object.keys(category_data[j])[0]; //get the name for this class
			//search the value in the array "category_data_total"
			//for this class, trying to accumulate the value
			for(var k = 0; k < category_data_total.length; k++) {
				//get the information for this class
				//in the array "category_data_total"
				var element_total = category_data_total[k];
				var element_name_total = Object.keys(element_total)[0]; //get the name for this class
				//if two names are match, means this is
				//the one we are looking for
				if(element_name_total == class_name) {
					var class_value = Object.values(category_data[j])[0]; //get the current value first
					//then accumulate the current value to the array
					category_data_total[k][element_name_total] = category_data_total[k][element_name_total] + class_value;
				}
			}
		}
	}

	//here we need to get the total value from the array
	//in order to calculate the specific percentage for each class
	var value_total = 0; //first set this value to be 0
	for(var i = 0; i < category_data_total.length; i++) {
		var element_value = Object.values(category_data_total[i])[0];
		value_total = value_total + element_value;
	}
	//console.log(category_data_total);
	//console.log(value_total);
	/*
	 ####################
	*/

	//Initialize an empty svg block
	var svg = d3.select(div_id).append("svg")
		.attr("class", "pie_chart")
		.attr("height", height) //Define height
		.attr("width", width); //Define width

	/*
	 ####################
	 This part of code tries to construct a function
	 for calculating how big the slices should be
	 in the pie
	 this function can return appropriate starting
	 angle and ending angle for each slice according
	 to the data
	*/
	var pie_function = d3.pie()
		.sort(function(d) {
			//By defining this,we want this function to
			//create slices sorted clockwise according
			//to the class names
			return Object.keys(d)[0];
		})
		.value(function(d) {
			//since in the array "category_data_total"
			//the value for each object decides how big
			//the slices in the pie should be
			//this is where we specify this relationship
			return Object.values(d)[0];
		});
	/*
	 ####################
	*/

	//define a function for arc with the same
	//radius like the pie, so we can use this
	//to get the information like the positions
	//of centroids for slices, see how it works below
	var arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(inner_radius);

	//define the position of the center for this pie
	var pie_body = svg.append("g")
		.attr("class", "pie")
		.attr("transform", "translate(" +
			(radius + margin.left) +
			"," +
			(radius + margin.top) + ")");

	//initialize the group block for slices
	var pie_slices = pie_body.append("g")
		.attr("class", "slices_g");
	/*
	  initialize all slices in the pie and
	  bind the data with each one.
	  here "pie_function" can calculate the 
	  appropriate size for each slice
	*/
	var slices = pie_slices.selectAll("path.arc")
		.data(pie_function(category_data_total))
		.enter()
		.append("path")
		.attr("class", "arc")
		.attr("fill", function(d, i) {
			//initialize the color for each slice
			return colors[i % 20];
		});
	//define how slices can be created in terms of transition
	slices.transition()
		.attrTween("d", function(d) {
			//console.log(d);
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

	//initialize the group block for numbers in
	//the centers of slices
	var detailsG = pie_body.append("g")
		.attr("class", "details_g");
	//initialize all numbers in the centers of slices
	var details_info = detailsG.selectAll("text.details_info")
		.data(pie_function(category_data_total))
		.enter()
		.append("text")
		.attr("class", "details_info")
		/*
		  according to the starting angle
		  and the ending angle for each slice returned by
		  "pie_function", calculate the appropriate
		  x and y coordinates for nmubers
		  which are positions of centers in slices
		  returned by function "arc"
		*/
		.attr("x", function(d, i) {
			return arc.centroid(d)[0];
		})
		.attr("y", function(d, i) {
			return arc.centroid(d)[1];
		})
		.attr("text-anchor", "middle")
		.attr("style", "fill:#ffffff;font-size:10px") //style for number
		//calculate the appropriate percentage for each number
		.text(function(d, i) {
			//console.log(d);
			var percentage_num = (d.value / value_total) * 100;
			var percentage_string = percentage_num.toString();
			var end = percentage_string.indexOf(".") + 3;
			//console.log(percentage * 100);
			return percentage_string.substring(0, end) + "%";
		});

	//Show or hide the title
	var if_title = parameters["if_title"];
	if(if_title == true) {
		var title = parameters["title"];
		var title_font = parameters["title_font"];
		var title_left = parameters["title_left"];
		svg.append("text")
			.attr("class", "pie_chart_title")
			.attr("x", title_left) //set attribute x for this title
			//set attribute y for this title
			.attr("y", (margin.top - title_font.substring(0, 2)) / 2)
			.attr("style", "font-size:" + title_font) //style for title
			.text(title);
	}

	//Show or hide the legend
	var if_legend = parameters["if_legend"];
	if(if_legend == true) {
		var legend_left = parameters["legend_left"];
		//each legend is actually a rectangle in the graph
		svg.selectAll("rect.legend")
			.data(category_data_total)
			.enter()
			.append("rect")
			.attr("class", "legend")
			/*
			 set the position for legend
			 as well as the size and the color
			 */
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
		//initialize the information beside the legend
		svg.selectAll("text.legend_text")
			.data(category_data_total)
			.enter()
			.append("text")
			.attr("class", "legend_text")
			//set attribute x for this title
			.attr("x", margin.left + radius * 2 + legend_left + 20)
			//set attribute y for this title
			.attr("y", function(d, i) {
				var offset_top = (height - 20 * category_data_total.length) / 2;
				return i * 20 + offset_top + 8;
			})
			.attr("font-size", "10px") //set font size for information
			.text(function(d) {
				var legend_text = Object.keys(d)[0];
				return legend_text;
			});
	}

};