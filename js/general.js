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
 
 #################
 Note: Sometimes your chart could disappear or some elements in your
 chart could disappear. This is because the relative positions between
 some elements and your svg are misconfigured or unreasonable.
 I tried my best to make the configurations flexible for general purpose
 but the side effect is that the configuration for positions could become
 a tricky part.
 My suggestion is that first you make sure how big your svg is, and then
 accordingly configure for the chart, lastly configure for the elements
 #################
 
 ***************************************************
 */
$(document).ready(function() {

	/*
	 ##################################
	 			Bar Chart
	 ##################################
	 */
	//specify the data source for bar chart
	var data_source = "data_source/bar_chart.json";

	/*
	 this is the configuration for Bar Chart
	 make sure to clearly specify every variable
	 */
	var parameters_bar_chart = {
		"height": 500, // height for svg
		"width": 600, // width for svg
		/*
		 "bar_width" decides the width of bars, 0 is the
		  min value, which means there is no padding between bars
		  Larger the value is, larger the padding between bars is
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
		"title_font": "20px", // customize the font size for title, ##must be px##
		"title_left": 250 // the left margin for title
	};
	var div_id_bar_chart = "#bar_chart"; // specify where you want to put this chart
	/*
	  after all configurations are done, we need to initalize the graph
	 */
	BarChart.initGraph(data_source, parameters_bar_chart, div_id_bar_chart);

	/*
	##################################
				Pie Chart
	##################################
	*/
	/*
	 this is the configuration for Pie Chart
	 make sure to clearly specify every variable
	 
	 for pie chart, we use the same data source like
	 bar chart, so here no specification for "data_source"
	 */
	var parameters_pie_chart = {
		"height": 500, // height for svg
		"width": 600, // width for svg
		"radius": 200, // customize the radius for pie
		/*
		 0 is the min value, which means you don't want
		 a inner blank pie within your pie chart.
		 if you specify any value bigger than 0,
		 you will get a inner blank pie inside your pie chart.
		 this kind of style is also called donut chart
		 */
		"inner_radius": 0,
		"margin": { // margin for the chart within svg
			"top": 70,
			"left": 50
		},
		/*
		  feel free to specify any kind of combinations
		  for example, ["Month 1"] for month 1 only
		  or ["Month 1", "Month 3"] for month 1 and 3 and so on.
		  then all values will be accumulated and pie chart shows
		  the overall distribution.
		  make sure to get the values right.
		 */
		"category": ["Month 1"],
		"if_title": true, // hide or show title
		"title": "pie chart", // customize the title
		"title_font": "20px", // customize the font size for title, ##must be px##
		"title_left": 250, // the left margin for title
		"if_legend": true, // hide or show legend
		"legend_left": 20 // the left margin for legend, related to pie
	};
	var div_id_pie_chart = "#pie_chart"; // specify where you want to put this chart
	/*
	  after all configurations are done, we need to initalize the graph
	 */
	PieChart.initGraph(data_source, parameters_pie_chart, div_id_pie_chart);

	/*
	##################################
			Horizonal Chart
	##################################
	*/

	/*
	 this is the configuration for Horizonal Chart
	 make sure to clearly specify every variable
	 */

	data_source = "data_source/horizonal_chart.json";
	var parameters_horizonal_chart = {
		"height": 300, // height for svg
		"width": 600, //width for svg
		/*
		 This variable controls the height of bars in the graph
		 Larger the value is, more thin the bars are
		 0 should be the min for this
		 Be careful about this variable since the bars could disappear
		 if the value is too large
		 */
		"bar_height": 20,
		"margin": { // margin for the chart within svg
			"top": 10,
			"left": 50,
			"right": 30,
			"bottom": 100
		},
		/*
		  feel free to specify any kind of combinations
		  for example, ["Group 1"] for group 1 only
		  or ["Group 1", "Group 3"] for group 1 and 3 and so on.
		  then the horizonal chart can be created accordingly.
		  make sure to get the values right.
		 */
		"category": ["Group 1", "Group 2", "Group 3"],
		"y_axis": false, // hide or show y_axis line
		/*
		 This variable controls the width of text box in the graph
		 Larger the value is, wider the text box is
		 0 should be the min for this, but the box would disappear
		 */
		"min_width_text": 40,
		/*
		 This variable controls the height of text box in the graph
		 Larger the value is, more thin the text box is
		 The reasonable range for this variable is 0 ~ 1
		 1 means the text box would have the same height as bars
		 Be careful about this variable since the text could disappear
		 if the value is too large
		 */
		"height_text_factor": 0.8,
		/*
		 This variable controls the right margin for the text box in the
		 respective bar.
		 Larger the value is, larger the right margin is
		 1 means there is no right margin for the text box, so 1 should 
		 be the min value for this variable
		 */
		"width_text_margin": 1.1,
		"if_legend": true, //hide or show the legend
		/*
		 This variable controls the padding between elements in the legend.
		 Larger the value is, larger the padding is
		 0 could cause all elements overlapping
		 try multiple values until you get the optimal one
		 */
		"legend_width": 100,
		"legend_top": 20 //the margin top for the legend
	};
	var div_id_horizonal_chart = "#horizonal_chart"; //specify where you want to put this chart
	/*
	  after all configurations are done, we need to initalize the graph
	 */
	HorizonalChart.initGraph(data_source, parameters_horizonal_chart, div_id_horizonal_chart);

	/*
	##################################
				Line Chart
	##################################
	*/

	/*
	 this is the configuration for Line Chart
	 make sure to clearly specify every variable
	 */

	data_source = "data_source/line_chart.json";
	var parameters_line_chart = {
		"height": 500, // height for svg
		"width": 600, // width for svg
		/*
		 This variable controls paddings among the categories in x_axis line,
		 then affect the length of lines
		 The range for this variable is 0 ~ 1
		 0 means the biggest paddings, 1 means the smallest ones
		 The reasonable value is 0.5
		 */
		"padding": 0.5,
		/*
		 This variable controls the width of lines.
		 Larger the value is, more thick the line is
		 */
		"line_width": 5,
		"x_axis": false, // show or hide the x_axis line
		"y_axis": false, // show or hide the y_axis line
		"grid_lines": true, // show or hide the grid line
		/*
		 This variable controls the horizonal position for the text box.
		 Larger the value is, more left the position is.
		 0 is min.
		 */
		"text_offset_x": 17.5,
		/*
		 This variable controls the vertical position for the text box.
		 Larger the value is, more top the position is
		 0 is min.
		 */
		"text_offset_y": 25,
		/*
		 This variable controls the width for the text box.
		 larger the value is, wider the text box is
		 0 is min, but the text box would disappear
		 */
		"text_box_width": 35,
		/*
		 This variable controls the height for the text box.
		 Larger the value is, taller the text box is
		 0 is min, but the text box would disappear
		 */
		"text_box_height": 20,
		"margin": { // margin for the chart within svg
			"top": 70,
			"left": 40,
			"right": 30,
			"bottom": 30
		},
		/*
		  feel free to specify any kind of combinations
		  for example, ["Part 1"] for part 1 only
		  or ["Part 1", "Part 3"] for part 1 and 3 and so on.
		  then the line chart can be created accordingly.
		  different lines represent different parts
		  make sure to get the values right.
		 */
		"category": ["Part 1", "Part 2", "Part 3"],
		"if_title": true, // show or hide the title
		"title": "line chart", // customize the content of title
		"title_font": "20px", // customize the font size for title, ##must be px##
		"title_left": 250 // margin left for title
	};
	var div_id_line_chart = "#line_chart"; //specify where you want to put this chart
	/*
	  after all configurations are done, we need to initalize the graph
	 */
	LineChart.initGraph(data_source, parameters_line_chart, div_id_line_chart);

});