/**
 * Created by admin on 2016. 5. 6..
 */
var width = 960,
	height = 500;

var radius = 50;
//            radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(10);
//            .innerRadius(0);

var labelArc = d3.svg.arc()
	.outerRadius(radius )
	.innerRadius(radius );

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) { return +d.Beautiful; });

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.tsv("data/ted_0.5_test.tsv", function(error, data){
	if (error) throw error;

	var g = svg.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc");

	console.log(radius);

	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.role); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.data.role; });
});

function type(d) {
	d.population = +d.population;
	return d;
}


