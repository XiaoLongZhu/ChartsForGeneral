$(document).ready(function() {

	var data_source = "data_source/bar_chart.json";
	var parameters_bar_chart = {
		"height": 450,
		"width": 600,
		"bar_width": 5,
		"x_axis": false,
		"y_axis": false,
		"grid_lines": true,
		"margin": {
			"top": 30,
			"left": 40,
			"right": 30,
			"bottom": 30
		},
		"category": ["Month 1", "Month 2", "Month 3"]
	};
	var div_id_bar_chart = "#bar_chart";
	BarChart.initGraph(data_source, parameters_bar_chart, div_id_bar_chart);

	var parameters_pie_chart = {
		"height": 450,
		"width": 600,
		"radius": 200,
		"inner_radius": 0,
		"margin": {
			"top": 30,
			"left": 40,
			"right": 30,
			"bottom": 30
		},
		"category": ["Month 1"]
	};
	var div_id_pie_chart = "#pie_chart";
	PieChart.initGraph(data_source, parameters_pie_chart, div_id_pie_chart);

	data_source = "data_source/bar_chart_overall.json";
	var parameters_bar_chart_overall = {
		"height": 150,
		"width": 600,
		"bar_width": 15,
		"margin": {
			"top": 10,
			"left": 50,
			"right": 30,
			"bottom": 10
		},
		"category": ["Group 1", "Group 2", "Group 3"],
		"y_axis": false,
		"min_width_text": 40,
		"width_text_factor": 0.9,
		"width_text_margin": 1.1
	};
	var div_id_bar_chart_overall = "#bar_chart_overall";
	BarChartOverall.initGraph(data_source, parameters_bar_chart_overall, div_id_bar_chart_overall);

	data_source = "data_source/line_chart.json";
	var parameters_line_chart = {
		"height": 450,
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
			"top": 30,
			"left": 40,
			"right": 30,
			"bottom": 30
		},
		"category": ["Part 1", "Part 2", "Part 3"]
	};
	var div_id_line_chart = "#line_chart";
	LineChart.initGraph(data_source, parameters_line_chart, div_id_line_chart);

});