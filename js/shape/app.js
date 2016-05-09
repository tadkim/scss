/**
 * Created by admin on 2016. 5. 6..
 */


var svgSize = {w:1280, h:960};
var svgMargin = { top:30, right: 30, bottom: 30, left:30};
var characterMargin = {top:10, right: 10, bottom: 10, left:10};

//scale binder
var scales = {
	body:{
		w:d3.scale.linear().domain([1,744]).range([180,280]),
		h:d3.scale.linear().domain([1,744]).range([180, 280])
	}
};


var outerRadius = 70,
	innerRadius = 20,
	t = 1,
	indexCounter=0;

var xPos  = svgMargin.left + characterMargin.left;
var yPos  = 100;
var yGap  = 280;


var svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w)
	.attr("height", svgSize.h)
	.attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");

var clip = svg.append("defs");

//Load Data
d3.tsv("data/ted_0.5_test.tsv", function(error, dataset) {
	if (error) {
		console.log("Data Loading ERROR^^");
	}

	//type assignment
	dataset.forEach(function (d, i) {
		d.Beautiful = +d.Beautiful;
	});







	var g_arc = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.attr("transform", function(){ return getPositionByIndex()});
		// .attr("transform", "translate(" + characterMargin.left + "," + characterMargin.top + ")");

	//g_arc_border : group  영역 확인을 위한 선
	var g_arc_boder = g_arc.append("rect")
		.attr("width", 280)
		.attr("height", 280)
		.attr("stroke", "aqua")
		.attr("fill", "none");



	var arc = d3.svg.arc()
		.innerRadius(outerRadius)
		.outerRadius(innerRadius)
		.startAngle(0)
		.endAngle(Math.PI);


	g_arc.append("path")
		.attr("class", "arc-round")
		.attr("d", arc.cornerRadius((outerRadius - innerRadius) / 2 * t))
		// .attr("d", arc)
		.attr("transform", "translate(140, 140)");


//머리 -----------------------------------------------------------------
	var defaultHeads = g_arc.append("rect")
		.attr("width", function(d, i){ return scales.body.w(d.Beautiful); })
		.attr("height", function(d, i){ return scales.body.h(d.Beautiful); })
		.attr("rx", 50)
		.attr("ry", 50)
		.attr("fill", "hsl(50,85%,60%)")
		//기본 groups의 너비 (140)이동후 현재 rect의 각 w, h값을 뺀 후 이동
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140-(cu_size/2)) + "," + (140-(cu_size/2)) +")";
		});


//클리핑패스  -----------------------------------------------------------------

	clip
		.append("svg:clipPath").attr("id", "clip")
		.append("svg:rect").attr("class", "clip-rect")
		.attr("width", 500)
		.attr("height", 300)
		.attr("transform", function(i){
			console.log("i");
			return "translate(100, 0)";
			// var cu_size = scales.body.h(d.Beautiful);
			// return "translate(" + (140-(cu_size/3)) + "," + (140) +")";
		});

	// 라인그래프 객체  -----------------------------------------------------------------
	var miniunz_panz =  g_arc.append("rect")
		.attr("width", function(d, i){ return scales.body.w(d.Beautiful)-50; })
		.attr("height", function(d, i){ return scales.body.h(d.Beautiful)-50; })
		.attr("rx", 0)
		.attr("ry", 0)
		.attr("clip-path", "url(#clip)")
		.attr("fill", "#5d89aa")
		//기본 groups의 너비 (140)이동후 현재 rect의 각 w, h값을 뺀 후 이동
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140-(cu_size/3)) + "," + (140) +")";
		});







	var defaultEyes_LEFT = g_arc.append("circle")
		.attr("r", 20)
		.attr("fill", "white")
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140-(cu_size/4)) + "," + (140-(cu_size/4)) +")";
	});


	var defaultEyes_RIGHT = g_arc.append("circle")
		.attr("r", 20)
		.attr("fill", "white")
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140+(cu_size/4)) + "," + (140-(cu_size/4)) +")";
	});

	var defaultEyes_LEFT_INNER = g_arc.append("circle")
		.attr("r", 6)
		.attr("fill", "black")
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140-(cu_size/4)) + "," + (140-(cu_size/4)) +")";
		});


	var defaultEyes_RIGHT_INNER = g_arc.append("circle")
		.attr("r", 6)
		.attr("fill", "black")
		.attr("transform", function(d, i){
			var cu_size = scales.body.h(d.Beautiful);
			return "translate(" + (140+(cu_size/4)) + "," + (140-(cu_size/4)) +")";
		});




}); // end d3.tsv()



function getPositionByIndex(){
	indexCounter = indexCounter+1;
	var resultPos;

	switch(indexCounter) {
		case 1 :
			resultPos =  "translate(30," + yPos + ")";
			break;
		case 2:
			resultPos =  "translate(310," + yPos + ")";
			break;
		case 3:
			resultPos = "translate(590," + yPos + ")";
			break;
		case 4:
			resultPos = "translate(870," + yPos + ")";
			break;
		case 5:
			indexCounter = 0;
			yPos = yPos + yGap;
			resultPos =  "translate(30," + yPos + ")";
			break;
		default:
			resultPos = "translate(30," + yPos + ")";
			break;
	}
	return resultPos;
}
/*

var polygons = group.append("polyline")
	.style("stroke", "yellow")  // colour the line
	.style("fill", "none")     // remove any fill colour
	.attr("points", drawPolygon(4, 500, 500, 100));  // x,y points
// .attr("points", "100,50,200,150,300,50");  // x,y points (default)

*/