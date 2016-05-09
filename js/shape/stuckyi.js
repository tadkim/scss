/**
 * Created by admin on 2016. 5. 6..
 */

var svgSize = { w:900, h:560 };
var svgMargin = { top:10, right:10, bottom:10, left:10 };
var  svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w)
	.attr("height", svgSize.w)
	.attr("transform", "translate(" + svgMargin.top + "," + svgMargin.left + ")");

// Scale : test
var testScale = d3.scale.linear()
	.range([svgMargin.left, svgSize.w-svgMargin.right]);



//Load Data
d3.tsv("data/ted_0.5_test.tsv", function(error, dataset){
	if(error){ console.log("Data Loading ERROR^^");}

	//type assignment
	dataset.forEach(function(d, i){
		d.Beautiful = +d.Beautiful;
	});

	//assignment : testScale's domain()
//        testScale.domain([0, d3.max(dataset, function(d){ return d.Beautiful; })]);
	//test min : 2, max:27
	//add element 1 - head
	var head = svg
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("width", 200)
		.attr("height", 200)
		.attr("x", function(d, i){ return i*280;})
		.attr("y", 20)
		.attr("rx", 10)
		.attr("ry", 10)
		.attr("fill", "#ffcc99");
//                .attr("class", function(d,i){ return getHeadClass(d.Beautiful); });


	//add element 2 - eyes
	var eyes = head
		.append("div")
		.attr("x", function(d){ return 10; })
		.attr("y", 10)
		.attr("width", 10)
		.attr("height", 10);



	//- for test --------------------------------------------------------------
	var data = [1, 1, 2, 3, 5, 8, 13, 21];

	var width = 960,
		height = 500,
		outerRadius = height / 2 - 30,
		innerRadius = outerRadius / 3;

	var pie = d3.layout.pie().padAngle(.03);

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	var svg2 = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var straightPath = svg2.append("g")
		.attr("class", "paths--straight")
		.selectAll("path")
		.data(data)
		.enter().append("path");

	var roundPath = svg2.append("g")
		.attr("class", "paths--round")
		.selectAll("path")
		.data(data)
		.enter().append("path");

	var ease = d3.ease("cubic-in-out"),
		duration = 2500;

	d3.timer(function(elapsed) {
		var t = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2),
			arcs = pie(data);

		straightPath.data(arcs).attr("d", arc.cornerRadius(0));
		roundPath.data(arcs).attr("d", arc.cornerRadius((outerRadius - innerRadius) / 2 * t));
	});


});

//데이터셋의 특정 변수를 인자로 받아 클래스 명을 리턴해주는 함수
function getHeadClass(sv){
	//테스트 : 2~ 27
	var currentSV = sv;
	if(0 < currentSV && currentSV <  5){
		return "El_head head_A";
	} else{
		return "El_head head_B";
	}
}
