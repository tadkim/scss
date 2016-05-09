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

	//d3.area()활용 -----------------------------------------------------------------
	var g_area = svg.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.attr("transform", function(){return getPositionByIndex()}); //function해줘야 전체가들어가고, 안하면 1번만 들어감.

	//콘텐츠 영역 확인 위한 rectArea element 추가
	g_area.append("rect")
		.attr("width", initSizes.contentsArea.w).attr("height",  initSizes.contentsArea.h)
		.attr("stroke", "aqua").attr("fill", "none");


//using d3.arc() -----------------------------------------------------------------
	var area = d3.svg.area()
		.interpolate(function(points) { return points.join("A 1,1 0 0 1 "); }) // custom interpolator
		.x(function(d){ return d.Beautiful; })
		.y0(280)
		.y1(function(d){ return  scales.test_area.h(d.Beautiful+20); });



	q_area.append("path").attr("d", computeTilt(200, 200, 40));

		// .attr("transform", "translate(140, 140)");





}); // end d3.tsv()


// 콘텐츠 별 위치 결정 함수  -----------------------------------------------------------------
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

// 기울기 계산 후 Quadratic 객체 생성함수  --------------------------------------------------
function computeTilt(width, height, middleWidth){
	//size attributes
	var  a = width/2,
		b = height/2,
		c = middleWidth/2; //middle width''

	//compute quadratic bezier curve point (x, y)
	var  a1  = { x:-a/2, y:-3*b/4 },
		a2 = { x:-a, y:-b/2 },
		a3 = { x:-(a+c)/2, y:-b/4 },
		a4 = { x:-c, y:0},
		a5 = { x:-(a+c)/2, y:b/4 },
		a6 = { x:-a, y:b/2},
		a7 = { x:-a/2, y:3*b/4 },
		a8 = { x:0, y:b },
		a9 = { x:a/2, y:3*b/4},
		a10 = { x:a, y:b/2 },
		a11 = { x:(a+c)/2, y:b/4},
		a12 = { x:c, y:0 },
		a13 = { x:(a+c)/2, y:-b/4 },
		a14 = { x:a, y:-b/2 },
		a15 = { x:a/2, y:-3*b/4 },
		a16 = { x:0, y:-b};

	//MoveTo
	var MV = "M" + a1.x + "," + a1.y;

	//Quadratics
	var Q1 = " Q " + a2.x + "," + a2.y + " " +  a3.x + "," + a3.y ;
	var Q2 = " Q " +  a4.x + "," + a4.y + " " +  a5.x + "," + a5.y ;
	var Q3 = " Q " +  a6.x + "," + a6.y + " " +  a7.x + "," + a7.y ;
	var Q4 = " Q " +  a8.x + "," + a8.y + " " +  a9.x + "," + a9.y ;
	var Q5 = " Q " +  a10.x + "," + a10.y + " " +  a11.x + "," + a11.y ;
	var Q6 = " Q " +  a12.x + "," + a12.y + " " +  a13.x + "," + a13.y ;
	var Q7 = " Q " +  a14.x + "," + a14.y + " " +  a15.x + "," + a15.y ;
	var Q8 = " Q " +  a16.x + "," + a16.y + " " +  a1.x + "," + a1.y ;

	//return values
	return MV + Q1 + Q2 + Q3 + Q4 + Q5 + Q6 + Q7+ Q8;
}

