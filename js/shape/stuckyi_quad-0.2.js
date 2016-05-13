/**
 * Created by admin on 2016. 5. 6..
 */


var svgSize = {w:1280, h:100960};
var svgMargin = { top:30, right: 30, bottom: 30, left:30};
var characterMargin = {top:10, right: 10, bottom: 10, left:10};

//콘텐츠 기본영역 설정 -----------------------------------------------------------------
var initSizes = {
	contentsArea : {w:280, h:280},
	mouth :{ w:40, h:20 },
	mouth_inner :{ w:40, h:10 }
};


//scale binder
var scales = {
	body:{
		w:d3.scale.linear().range([200,280]),
		h:d3.scale.linear().range([240, 280]),
		mw:d3.scale.linear().range([30, 100])
	},
	eyes:{ r:d3.scale.linear().range([10,40]) },
	pupil:{ r:d3.scale.linear().range([2,4]) },
	nose:{
		w:d3.scale.linear().range([30,40])
	},
	mouth:{
		w:d3.scale.linear().range([30,32]),
		h:d3.scale.linear().range([10, 90])
	},
	totalViews:{
		w:d3.scale.linear().range([100,130]),
		h:d3.scale.linear().range([210, 280]),
		mw:d3.scale.linear().range([80, 90])
	},
	t:{
		h1:d3.scale.linear().range([50,150]),
		w1:d3.scale.linear().range([80, 250]),
		w2:d3.scale.linear().range([40, 200]),
		w3:d3.scale.linear().range([80, 250]),
	}

};


var t = 1,
	indexCounter=0;

var xPos  = svgMargin.left + characterMargin.left;
var yPos  = 100;
var yGap  = 280;

var svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w).attr("height", svgSize.h)
	.attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");


//Load Data
// d3.tsv("data/ted_0.5_test.tsv", function(error, dataset) {
d3.tsv("data/ted_0.6_all.tsv", function(error, dataset) {
	if (error) {
		console.log("Data Loading ERROR");
	}

	//type assignment
	dataset.forEach(function (d) {
		//totalViews
		d.totalViews = +d.totalViews; //조회수

		//Rate
		d.r_beautiful = +d.r_beautiful; //뷰리뽀 Beautiful Rate Count
		d.r_jawdropping = +d.r_jawdropping; //입이 벌어지다
		d.r_unconvincing = +d.r_unconvincing; // 설득력이 없는.
		d.r_ok = +d.r_ok; // 설득력이 없는.
		d.r_inspiring = +d.r_inspiring;
		d.r_funny = +d.r_funny;
		d.r_ingenious = +d.r_ingenious;
		d.r_persuasive = +d.r_persuasive;
		d.r_courageous = +d.r_courageous;
		d.r_informative = +d.r_informative;
		d.r_confusing = +d.r_confusing;
		d.r_obnoxious = +d.r_obnoxious;
		d.r_longwinded = +d.r_longwinded;
		d.r_fascinating = +d.r_fascinating;





		d.posVal = +d.posVal; //전체 투표 중 긍정 투표 수(개)
		d.negVal = +d.negVal; //전체 투표 중 부정 투표 수(개)

		d.posPer = +d.posPer; //전체 투표 중 긍정 투표 비율(%)
		d.negPer = +d.negPer; //전체 투표 중 부정 투표 비율(%)

		//duration
		d.dur_sec = +d.dur_sec; //총 영상의 길이(초)
		//period
		d.period = +d.period; //기간(월, 2015.05 기준)

	});
	//Scale set ============================================================

/*
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

*/


	//case 2 body  스케일 조정
	scales.t.h1.domain(d3.extent(dataset, function(d) { return d.r_informative; }));

	scales.t.w1.domain(d3.extent(dataset, function(d) { return d.r_beautiful; }));
	scales.t.w2.domain(d3.extent(dataset, function(d) { return d.r_inspiring; }));
	scales.t.w3.domain(d3.extent(dataset, function(d) { return d.r_courageous; }));

	//데이터 셋 필터링
	// dataset = dataset.filter(function(element){ return element.Beautiful > 2000; });


	//드로잉 테마 호출
	drawTheme(dataset);

}); // end d3.tsv()




//여러 버전의 드로잉테마를 하나로 합치기 ---------------------
function drawTheme(datarow) {
	var dataname = datarow;


	drawTheme_case2(dataname);
	function drawTheme_case1(d_nm) {

		//d3.area()활용 -----------------------------------------------------------------
		var g_area = svg.selectAll("g")
			.data(d_nm).enter()
			.append("g")
			.attr("transform", function () {return getPositionByIndex() });

		//콘텐츠 영역 확인 위한 rectArea element 추가
		var g_viewer = g_area.append("rect")
			.attr("width", initSizes.contentsArea.w).attr("height", initSizes.contentsArea.h)
			.attr("stroke", "aqua").attr("fill", "none");


		var g_center = g_area.append("g")
			.attr("transform", "translate(140,140)");

		//몸체 ===============================================================
		var bodyEl = g_center.append("path")
			.attr("d", function (d) {
				return computeTilt(
					scales.body.w(d.Beautiful),
					scales.body.h(d.Beautiful),
					scales.body.mw(d.Beautiful)
				);
			});


		//눈 ===============================================================
		var eyes_left = g_center.append("circle")
			.attr("r", function(d){ return scales.eyes.r(d.Beautiful);})
			.attr("fill", "white")
			.attr("class", "eyes_left")
			.attr("transform", function(d){
				return "translate(" +  (- scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});

		var eyes_right = g_center.append("circle")
			.attr("r", function(d){ return scales.eyes.r(d.Beautiful);})
			.attr("fill", "white")
			.attr("class", "eyes_right")
			.attr("transform", function(d){
				return "translate(" +  ( scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});

		//Pupil(눈동자) =============================================================
		var pupil_left = g_center.append("circle")
			.attr("r", function(d){ return scales.pupil.r(d.Beautiful); })
			.attr("fill", "black")
			.attr("transform", function(d){
				return "translate(" + (- scales.eyes.r(d.Beautiful)) + "," + (-initSizes.contentsArea.w/4) + ")";
			});

		var pupil_right = g_center.append("circle")
			.attr("r", function(d){ return scales.pupil.r(d.Beautiful); })
			.attr("fill", "black")
			.attr("transform", function(d){
				return "translate(" +  ( scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});

//Mouth(입) =============================================================
		var pathMouth = g_center.append("rect")
			.attr("width", initSizes.mouth.w)
			.attr("height", function(d){ return scales.mouth.h(d.Jaw_dropping);})
			.attr("rx", 8).attr("ry", 8)
			.attr("fill", "#BB2244")
			.attr("transform", function (d) {
				return "translate(" + -initSizes.mouth.w/2 + ","  + (-initSizes.mouth.h) + ")";
			});
		var pathMouth_inner = g_center.append("rect")
			.attr("width", initSizes.mouth_inner.w)
			.attr("height", function(d){ return scales.mouth.h(d.Jaw_dropping)-10;})
			.attr("rx", 4).attr("ry", 4)
			.attr("fill", "white")
			.attr("transform", function (d) {
				return "translate(" + (-(initSizes.mouth.w)/2)+ ","  + (-initSizes.mouth.h) + ")";
			});


		var nose = g_center.append("rect")
			.attr("fill", "#CEAB69")
			.attr("width", function(d){ return scales.nose.w(d.Unconvincing); })
			.attr("height", 10)
			.attr("rx", 4).attr("ry", 4)
			.attr("class", "nose")
			.attr("transform", function(d){
				return "translate(0," + (-initSizes.contentsArea.w/6) + ")";
			});

		console.log(pathMouth[0][0].getBBox());

	}
	function drawTheme_case2(d_nm) {

		//d3.area()활용 -----------------------------------------------------------------
		var g_area = svg.selectAll("g")
			.data(d_nm).enter().append("g").attr("transform", function () {return getPositionByIndex() });

		//콘텐츠 영역 확인 위한 rectArea element 추가
		var g_viewer = g_area.append("rect")
			.attr("width", initSizes.contentsArea.w).attr("height", initSizes.contentsArea.h)
			.attr("stroke", "aqua").attr("fill", "none");


		var g_center = g_area.append("g").attr("transform", "translate(140,140)");

		//몸체 ===============================================================
		var bodyEl = g_center.append("path")
			.attr("d", function (d) {

				// return getPeanut(200, 100, 150, 30, 90, 1, 1);

				var width1= scales.t.w1(d.r_beautiful);
				var width3= scales.t.w3(d.r_courageous);

				var randomforW2 = Math.floor((Math.random() * 500) + 1);

				// if(width1 < width3){ scales.t.w2.range([20, width1]); }
				// else { scales.t.w2.range([2, width3 ]); }

				if(width1 < width3){ scales.t.w2.domain([0, 500]).range([1, width1*2]); }
				else { scales.t.w2.domain([0, 500]).range([1, width3*2 ]); }

				var randomA = Math.floor((Math.random() * 3) + 1);
				var randomB = Math.floor((Math.random() * 3) + 1);



				return getPeanut(
					scales.t.h1(d.r_informative),
					200-(scales.t.h1(d.r_informative)),
					scales.t.w1(d.r_beautiful),
					// scales.t.w2(d.r_inspiring),
					scales.t.w2(randomforW2),
					scales.t.w3(d.r_courageous),
					randomA,
					randomB
				);

			});





		//눈 ===============================================================
		var eyes_left = g_center.append("circle")
			.attr("r", function(d){ return scales.eyes.r(d.Beautiful);})
			.attr("fill", "white")
			.attr("class", "eyes_left")
			.attr("transform", function(d){
				return "translate(" +  (- scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});

		var eyes_right = g_center.append("circle")
			.attr("r", function(d){ return scales.eyes.r(d.Beautiful);})
			.attr("fill", "white")
			.attr("class", "eyes_right")
			.attr("transform", function(d){
				return "translate(" +  ( scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});
/*
		//Pupil(눈동자) =============================================================
		var pupil_left = g_center.append("circle")
			.attr("r", function(d){ return scales.pupil.r(d.Beautiful); })
			.attr("fill", "black")
			.attr("transform", function(d){
				return "translate(" + (- scales.eyes.r(d.Beautiful)) + "," + (-initSizes.contentsArea.w/4) + ")";
			});

		var pupil_right = g_center.append("circle")
			.attr("r", function(d){ return scales.pupil.r(d.Beautiful); })
			.attr("fill", "black")
			.attr("transform", function(d){
				return "translate(" +  ( scales.eyes.r(d.Beautiful)) + "," +  (-initSizes.contentsArea.w/4) + ")";
			});

//Mouth(입) =============================================================
		var pathMouth = g_center.append("rect")
			.attr("width", initSizes.mouth.w)
			.attr("height", function(d){ return scales.mouth.h(d.Jaw_dropping);})
			.attr("rx", 8).attr("ry", 8)
			.attr("fill", "#BB2244")
			.attr("transform", function (d) {
				return "translate(" + -initSizes.mouth.w/2 + ","  + (-initSizes.mouth.h) + ")";
			});
		var pathMouth_inner = g_center.append("rect")
			.attr("width", initSizes.mouth_inner.w)
			.attr("height", function(d){ return scales.mouth.h(d.Jaw_dropping)-10;})
			.attr("rx", 4).attr("ry", 4)
			.attr("fill", "white")
			.attr("transform", function (d) {
				return "translate(" + (-(initSizes.mouth.w)/2)+ ","  + (-initSizes.mouth.h) + ")";
			});


		var nose = g_center.append("rect")
			.attr("fill", "#CEAB69")
			.attr("width", function(d){ return scales.nose.w(d.Unconvincing); })
			.attr("height", 10)
			.attr("rx", 4).attr("ry", 4)
			.attr("class", "nose")
			.attr("transform", function(d){
				return "translate(0," + (-initSizes.contentsArea.w/6) + ")";
			});

			*/

		// console.log(pathMouth[0][0].getBBox());

	}

}


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
}

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
			indexCounter = 1;
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


function rightRoundedRect(x, y, width, height, radius) {
	return "M" + x + "," + y
		+ "h" + (width - radius)
		+ "a" + radius + "," + radius + " 1 0 1 " + radius + "," + radius
		+ "v" + (height - 2 * radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
		+ "h" + (radius - width)
		+ "z";
}