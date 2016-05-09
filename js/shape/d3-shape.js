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
	},
	test_area:{
		w:d3.scale.linear().domain([1,744]).range([30,280]),
		h:d3.scale.linear().domain([1,744]).range([30, 280])
	}
};


var outerRadius = 70,
	innerRadius = 20,
	t = 1,
	indexCounter=0;

var xPos  = svgMargin.left + characterMargin.left;
var yPos  = 100;
var yGap  = 280;

//콘텐츠 기본영역 설정 -----------------------------------------------------------------
var initSizes = {
	contentsArea : {w:280, h:280}
};

var svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w)
	.attr("height", svgSize.h)
	.attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");




//Load Data
d3.tsv("data/ted_0.5_test.tsv", function(error, dataset) {
	if (error) {
		console.log("Data Loading ERROR^^");
	}

	//type assignment
	dataset.forEach(function (d, i) {
		d.Beautiful = +d.Beautiful;
	});


	//d3.area()활용 -----------------------------------------------------------------
	var g_test = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.attr("transform", function(){return getPositionByIndex()}); //function해줘야 전체가들어가고, 안하면 1번만 들어감.

	//콘텐츠 영역 확인 위한 rectArea element 추가
	g_test.append("rect")
		.attr("width", initSizes.contentsArea.w).attr("height",  initSizes.contentsArea.h)
		.attr("stroke", "aqua").attr("fill", "none");


	//콘텐츠 영역 확인 위한 rectArea element 추가
	g_test.append("line")
		.attr("x1",  initSizes.contentsArea.w/2)
		.attr("y1",  -initSizes.contentsArea.h/2)
		.attr("x2",  initSizes.contentsArea.w/2)
		.attr("y2",  initSizes.contentsArea.h/2)
		.attr("stroke", "aqua")
		.attr("stroke-dasharray", "5,5");


	//콘텐츠 영역 확인 위한 rectArea element 추가
	g_test.append("line")
		.attr("x1",  -initSizes.contentsArea.w/2)
		.attr("y1",  initSizes.contentsArea.h/2)
		.attr("x2",  initSizes.contentsArea.w/2)
		.attr("y2",  initSizes.contentsArea.h/2)
		.attr("stroke", "aqua")
		.attr("stroke-dasharray", "5,5");




	//interpolation test -----------------------------------------------------------------

	var g_body = g_test.append("g")
		.attr("transform", function(){
			var centerX = initSizes.contentsArea.w/2;
			var centerY = initSizes.contentsArea.h/2;
			return "translate(" + centerX + "," + centerY + ")";
		});

	var circle_A = g_body.append("circle")
		.attr("r", 20)
		.attr("class", "test-circle")
		.attr("transform", "translate(-70, 0)" );


	var circle_B = g_body.append("circle")
		.attr("r", 40)
		.attr("class", "test-circle")
		.attr("transform", "translate(70, 0)" );


	var testPath = g_body.append("path")
		.attr("d", "M-70,0 C -35,-35 -35,-35 0,0z");






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