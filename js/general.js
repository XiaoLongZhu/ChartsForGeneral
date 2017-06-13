/*
 ***************************************************
 This is the starting point for all js functions
 
 Please specify data sources and parameters for visualizations.
 
 In each visualization, I use "$.getJSON()" from jQuery to get
 data from data source. If you don't want this style, feel free to
 change it in specific js file that you want to use in your project.
 
 There is a "initGraph" function for each visualization, which first
 gets data from data source using "$.getJSON()", then invokes "graphRender"
 function to draw the visualization. All elements of visualizations are
 included in <svg></svg>.
 
 You don't need to figure out how it works in "graphRender" function
 if time is short.
 ***************************************************
 */
$(document).ready(function() {

	//specify the data source for bar chart
	var data_source = "data_source/bar_chart.json";

	/*
	 this is the configuration for bar chart
	 make sure to clearly specify every variable
	 */
	var parameters_bar_chart = {
		"height": 500, // height for svg
		"width": 600, // width for svg
		/*
		 "bar_width" decides the width of bars, 0 is the
		  min value, which means there is no padding between bars
		  more big the value, more big the padding between bars
		 */
		"bar_width": 5,
		"x_axis": false, // hide or show x_axis line
		"y_axis": false, // hide or show y_axis line
		"grid_lines": true, // hide or show grid lines
		"margin": { // margin for the chart within svg
			"top": 100,
			"left": 40,
			"right": 30,
			"bottom": 20
		},
		/*
		  feel free to specify any kind of combinations
		  for example, ["Month 1"] for month 1 only
		  or ["Month 1", "Month 3"] for month 1 and 3 and so on.
		  then the bar chart can be created accordingly.
		  make sure to get the values right.
		 */
		"category": ["Month 1", "Month 2", "Month 3"],
		"if_title": true, //hide or show title
		"title": "bar chart", // customize the title
		"title_font": "20px", // customize the font size for title
		"title_left": 250
	};
	var div_id_bar_chart = "#bar_chart";
	BarChart.initGraph(data_source, parameters_bar_chart, div_id_bar_chart);

	/*
	 configurations for pie chart 
	 * */
	var parameters_pie_chart = {
		"height": 500,
		"width": 600,
		"radius": 200,
		"inner_radius": 0,
		"margin": {
			"top": 70,
			"left": 50
		},
		"category": ["Month 1"],
		"if_title": true,
		"title": "pie chart",
		"title_font": "20px", //must be px
		"title_left": 250,
		"if_legend": true,
		"legend_left": 20
	};
	var div_id_pie_chart = "#pie_chart";
	PieChart.initGraph(data_source, parameters_pie_chart, div_id_pie_chart);

	data_source = "data_source/horizonal_chart.json";
	var parameters_horizonal_chart = {
		"height": 300,
		"width": 600,
		"bar_width": 20,
		"margin": {
			"top": 10,
			"left": 50,
			"right": 30,
			"bottom": 100
		},
		"category": ["Group 1", "Group 2", "Group 3"],
		"y_axis": false,
		"min_width_text": 40,
		"height_text_factor": 0.8,
		"width_text_margin": 1.1,
		"if_legend": true,
		"legend_width": 100,
		"legend_top": 20
	};
	var div_id_horizonal_chart = "#horizonal_chart";
	HorizonalChart.initGraph(data_source, parameters_horizonal_chart, div_id_horizonal_chart);

	data_source = "data_source/line_chart.json";
	var parameters_line_chart = {
		"height": 500,
		"width": 600,
		"padding": 0.5, //0-1
		"line_width": 5,
		"x_axis": false,
		"y_axis": false,
		"grid_lines": true,
		"text_offset_x": 17.5,
		"text_offset_y": 25,
		"text_box_width": 35,
		"text_box_height": 20,
		"margin": {
			"top": 70,
			"left": 40,
			"right": 30,
			"bottom": 30
		},
		"category": ["Part 1", "Part 2", "Part 3"],
		"if_title": true,
		"title": "line chart",
		"title_font": "20px", //must be px
		"title_left": 250
	};
	var div_id_line_chart = "#line_chart";
	LineChart.initGraph(data_source, parameters_line_chart, div_id_line_chart);

});