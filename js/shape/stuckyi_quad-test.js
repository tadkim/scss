/**
 * Created by admin on 2016. 5. 6..
 */


var svgSize = {w:1280, h:13960};
var svgMargin = { top:30, right: 30, bottom: 30, left:30};
var characterMargin = {top:10, right: 10, bottom: 10, left:10};
var t = 1, indexCounter=0, xPos = svgMargin.left;

//콘텐츠 기본영역 설정
var initSizes = {
	contentsArea : {w:280, h:280},
	mouth :{ w:40, h:20 },
	mouth_inner :{ w:40, h:10 }
};
var yPos  = 100;
var yGap  = 380;

// SVG 생성
var svg = d3.select("#d3area").append("svg").attr("width", svgSize.w).attr("height", svgSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");


//Load Data
d3.tsv("data/test2.tsv", function(error, dataset) {
// d3.tsv("data/ted_0.5_all.tsv", function(error, dataset) {
	if (error) { console.log("Data Loading ERROR"); }

	//type assignment
	/*
	dataset.forEach(function (d) {
		//totalViews
		d.totalViews = +d.totalViews; //조회수

		//Rate
		d.Beautiful = +d.Beautiful; //뷰리뽀 Beautiful Rate Count
		d.Jaw_dropping = +d.Jaw_dropping; //입이 벌어지다
		d.Unconvincing = +d.Unconvincing; // 설득력이 없는.
		d.OK = +d.OK; // 설득력이 없는.

		d.posVal = +d.posVal; //전체 투표 중 긍정 투표 수(개)
		d.negVal = +d.negVal; //전체 투표 중 부정 투표 수(개)
		d.posPer = +d.posPer; //전체 투표 중 긍정 투표 비율(%)
		d.negPer = +d.negPer; //전체 투표 중 부정 투표 비율(%)

		//duration
		d.dur_sec = +d.dur_sec; //총 영상의 길이(초)
		//period
		d.period = +d.period; //기간(월, 2015.05 기준)

	// });
	*/
	dataset.forEach(function(d){
		d.h1 = +d.h1;
		d.h2 = +d.h2;
		d.w1 = +d.w1;
		d.w2 = +d.w2;
		d.w3 = +d.w3;
		d.a = +d.a;
		d.b = +d.b;
	});
	//Scale set function
	// setDomainByData(dataset); // 데이터셋 기반으로 scale의 domain 값을 설정한다

	//데이터 셋 필터링
	// dataset = dataset.filter(function(element){ return element.Beautiful > 2000; });

	//드로잉 테마 호출
	drawTheme(dataset);

}); // end d3.tsv()

//각 변수에 따른 스케일의 domain()설정 ---------------------
function setDomainByData(dataset){

	//mouth body
	scales.body.w.domain(d3.extent(dataset, function(d) { return d.totalViews; }));
	scales.body.h.domain(d3.extent(dataset, function(d) { return d.totalViews; }));
	scales.body.mw.domain(d3.extent(dataset, function(d) { return d.totalViews; }));

	//eyes 스케일 조정
	scales.eyes.r.domain(d3.extent(dataset, function(d) { return d.Beautiful; }));
	scales.pupil.r.domain(d3.extent(dataset, function(d) { return d.Beautiful; }));


	//mouth 스케일 조정
	scales.nose.w.domain(d3.extent(dataset, function(d) { return +d.Unconvincing; }) );

	//mouth 스케일 조정
	scales.mouth.w.domain(d3.extent(dataset, function(d) { return d.Jaw_dropping; }));
	scales.mouth.h.domain(d3.extent(dataset, function(d) { return d.Jaw_dropping; }));


	//case 2 body  스케일 조정
	scales.t.h1.domain(d3.extent(dataset, function(d) { return d.Beautiful; }));
	scales.t.h2.domain(d3.extent(dataset, function(d) { return d.Beautiful; }));

	scales.t.w1.domain(d3.extent(dataset, function(d) { return d.OK; }));
	scales.t.w2.domain(d3.extent(dataset, function(d) { return d.posPer; }));
	scales.t.w3.domain(d3.extent(dataset, function(d) { return d.negPer; }));

	scales.t.a.domain(d3.extent(dataset, function(d) { return d.posVal; }));
	scales.t.b.domain(d3.extent(dataset, function(d) { return d.negVal; }));

};

//drawing shape by data  ---------------------
function drawTheme(datarow) {
	var dataname = datarow;

	drawTheme_test(dataname);

	function drawTheme_test(d_nm) {

		//d3.area()활용 -----------------------------------------------------------------
		var g_area = svg.selectAll("g")
			.data(d_nm).enter().append("g")
			.attr("transform", function () {return getPositionByIndex() });

		//콘텐츠 영역 확인 위한 rectArea element 추가
		var g_viewer = g_area.append("rect")
			.attr("width", initSizes.contentsArea.w).attr("height", initSizes.contentsArea.h)
			.attr("stroke", "aqua").attr("fill", "none");


		var g_center = g_area.append("g")
			.attr("transform", "translate(140,140)");

		//몸체 ===============================================================
		var bodyEl = g_center.append("path")
			.attr("class", "testbody")
			.attr("d", function (d) { return getPeanut(d.h1, d.h2, d.w1, d.w2, d.w3, d.a, d.b); });

		// console.log(pathMouth[0][0].getBBox());

	}

}




//compute shape -----------------------------------------
function getPeanut(h1, h2, w1, w2, w3, a, b){

	var t0 = a+b;
	var t1 = a+2*b;
	var t2 = 2*a+b;
	var t3 = 2*(a+b);
	var t4 = w1-w2;
	var t5 = w3-w2;

	//compute quadratic bezier curve point (x, y)
	var  a1  = { x: -(b*w1)/t3 , y:-(t2*h1)/t3 },
		a2 = { x: -(w1)/2, y:-(h1)/2 },
		a3 = { x: -(w2*t0+a*t4)/t3, y: -(h1*a)/t3 },
		a4 = { x: -w2/2, y:0},
		a5 = { x: -(w2*t0+t5*b)/t3, y: (b*h2)/t3},
		a6 = { x: -w3/2, y:h2/2},
		a7 = { x: -(a*w3)/t3, y:(t1*h2)/t3 },
		a8 = { x:0, y:h2 },
		a9 = { x: (a*w3)/t3, y: (t1*h2)/t3},
		a10 = { x: w3/2, y:h2/2 },
		a11 = { x: (w2*t0+t5*b)/t3, y:(b*h2)/t3},
		a12 = { x: w2/2, y:0 },
		a13 = { x: (w2*t0+a*t4)/t3, y:-(h1*a)/t3 },
		a14 = { x: w1/2, y: -h1/2 },
		a15 = { x: b*w1/t3, y: -(t2*h1)/t3 },
		a16 = { x: 0, y:-h1};


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
} //Peanut - case1
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
} //ComputeTilt - Quadratic case1
function rightRoundedRect(x, y, width, height, radius) {
	return "M" + x + "," + y
		+ "h" + (width - radius)
		+ "a" + radius + "," + radius + " 1 0 1 " + radius + "," + radius
		+ "v" + (height - 2 * radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
		+ "h" + (radius - width)
		+ "z";
} // svg rect rounded (by mbostock)


//compute position ----------------------------------------
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
			indexCounter = 1;
			yPos = yPos + yGap;
			resultPos =  "translate(30," + yPos + ")";
			break;
		default:
			resultPos = "translate(30," + yPos + ")";
			break;
	}
	return resultPos;
} // 콘텐츠 별 위치 결정 함수
