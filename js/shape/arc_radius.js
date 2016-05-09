/**
 * Created by admin on 2016. 5. 6..
 */

var data = [1, 1, 2, 3, 5, 8, 13, 21];
var width = 960,
	height = 500,
	outerRadius = height / 2 - 30,
	innerRadius = outerRadius / 3;

var pie = d3.layout.pie()
	.padAngle(.03);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var straightPath = svg.append("g")
	.attr("class", "paths--straight")
	.selectAll("path")
	.data(data)
	.enter().append("path");

var roundPath = svg.append("g")
	.attr("class", "paths--round")
	.selectAll("path")
	.data(data)
	.enter().append("path");

var ease = d3.ease("cubic-in-out"),
	duration = 2500;

d3.timer(function(elapsed) {
	var t = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2),
		arcs = pie(data);

	//t is 0~1

	// console.log("t : " + t);
	straightPath.data(arcs).attr("d", arc.cornerRadius(0));
	roundPath.data(arcs).attr("d", arc.cornerRadius((outerRadius - innerRadius) / 2 * t));
});


