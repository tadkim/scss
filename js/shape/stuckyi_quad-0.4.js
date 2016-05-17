/**
 * Created by admin on 2016. 5. 6..
 */


var svgSize = {w:1280, h:100960};
var svgMargin = { top:30, right: 30, bottom: 30, left:30};
var characterMargin = {top:10, right: 10, bottom: 10, left:10};


//콘텐츠 기본영역 설정 -----------------------------------------------------------------
var initSizes = {
	contentsArea : {w:280, h:280},
	mouth :{ w:12, h:20 },
	mouth_inner :{ w:40, h:10 },
	eyes:{ outRadius:6, inRadius:2},
	legs:{ instep:10, leg_length:50, depth:240, legGaps:0.1, crt_w3:150 }
};
var t = 1, indexCounter=0;
var xPos  = svgMargin.left + characterMargin.left, yPos  = 100, yGap  = 280;

//scale binder
var scales = {
	body:{
		w:d3.scale.linear().range([200,280]),
		h:d3.scale.linear().range([240, 280]),
		mw:d3.scale.linear().range([30, 100])
	},
	eyes:{ r:d3.scale.linear().range([10,40]) },
	pupil:{ r:d3.scale.linear().range([2,4]) },
	nose:{ w:d3.scale.linear().range([30,40]) },
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
	},
	detail : {
		eyegap:d3.scale.linear().range([1, 10])
	},
	legGap : d3.scale.threshold()
		.domain([0, 100, 120, 150, 180, 200, 230]).range([0, 2, 4, 8, 12, 18, 28])
};




var svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w).attr("height", svgSize.h)
	.attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");


//Load Data
// d3.tsv("data/ted_0.5_test.tsv", function(error, dataset) {
d3.tsv("data/ted_0.6_all.tsv", function(error, dataset) {
	if (error) { console.log("Data Loading ERROR"); }

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
	scales.t.h1.domain(d3.extent(dataset, function(d) { return d.r_informative; }));
	scales.t.w1.domain(d3.extent(dataset, function(d) { return d.r_beautiful; }));
	scales.t.w2.domain(d3.extent(dataset, function(d) { return d.r_inspiring; }));
	scales.t.w3.domain(d3.extent(dataset, function(d) { return d.r_courageous; }));

	scales.detail.eyegap.domain(d3.extent(dataset, function(d) { return d.r_unconvincing; }));

	//SV (Shape Variables) Define==============================================
	dataset.forEach(function(d){
		//shape - random a,b ratio value.
		d.h1 =  scales.t.h1(d.r_informative),
		d.h2 = 200-(scales.t.h1(d.r_informative)),
		d.w1= scales.t.w1(d.r_beautiful),
		d.w2 = 0,
		d.w3= scales.t.w3(d.r_courageous),
		d.a = Math.floor(Math.random()*3)+1,
		d.b = Math.floor(Math.random()*3)+1;

		d.sheetType= (d.h1 < d.h2 === true)? "sheet2" : "sheet3"; //h1>h2 크기 비교후 sheet 타입



		//Set w2 value's Range (based on w1, w3)
		if(d.w1 < d.w3){
			scales.t.w2.range([1, d.w1]);
			d.w2 = scales.t.w2(d.r_inspiring);
		} else {
			scales.t.w2.range([1, d.w3 ]);
			d.w2 = scales.t.w2(d.r_inspiring);
		}
		//widthType 설정 : 이 기준으로 눈, 팔, 다리 길이 가 설정된다.
		d.widthType = getRatio(d.w1, d.w3); //"typeA"

		//다리길이 설정
		d.legLength = (d.widthType === "typeC")? 50 : initSizes.legs.leg_length ; // 눈이 아래있으면 50, 그 외의 경우 기본 값( default : 30 )



		//Variable Assignment for quadratic bezier curve point (x, y) ***
		d.t0 = d.a + d.b,
		d.t1 = d.a + 2 * d.b,
		d.t2 = 2 * d.a + d.b,
		d.t3 = 2 * (d.a + d.b),
		d.t4 = d.w1 - d.w2,
		d.t5 = d.w3 - d.w2;



		//compute quadratic bezier curve point (x, y)
		d.a1  = { x: -( d.b*d.w1)/d.t3 , y:-(d.t2*d.h1)/d.t3 },
		d.a2 = { x: -(d.w1)/2, y:-(d.h1)/2 },
		d.a3 = { x: -(d.w2*d.t0+d.a*d.t4)/d.t3, y: -(d.h1*d.a)/d.t3 },
		d.a4 = { x: -d.w2/2, y:0},
		d.a5 = { x: -(d.w2*d.t0+d.t5*d.b)/d.t3, y: (d.b*d.h2)/d.t3},
		d.a6 = { x: -d.w3/2, y:d.h2/2},
		d.a7 = { x: -(d.a*d.w3)/d.t3, y:(d.t1*d.h2)/d.t3 },
		d.a8 = { x:0, y:d.h2 },
	 	d.a9 = { x: (d.a*d.w3)/d.t3, y: (d.t1*d.h2)/d.t3},
		d.a10 = { x: d.w3/2, y:d.h2/2 },
		d.a11 = { x: (d.w2*d.t0+d.t5*d.b)/d.t3, y:(d.b*d.h2)/d.t3},
		d.a12 = { x:d.w2/2, y:0 },
		d.a13 = { x: (d.w2*d.t0+d.a*d.t4)/d.t3, y:-(d.h1*d.a)/d.t3 },
		d.a14 = { x: d.w1/2, y: -d.h1/2 },
		d.a15 = { x: d.b*d.w1/d.t3, y: -(d.t2*d.h1)/d.t3 },
		d.a16 = { x: 0, y:-d.h1};




		d.randomA = Math.floor(Math.random()*3)+1;
		d.randomB = Math.floor(Math.random()*3)+1;

	});


	// dataset = dataset.filter(function(element){ return element.Beautiful > 2000; }); //데이터 셋 필터링

	//드로잉 테마 호출
	drawTheme(dataset);
}); // end d3.tsv()


//여러 버전의 드로잉테마를 하나로 합치기 ---------------------
function drawTheme(datarow) {
	var dataname = datarow;

	//Call Theme functions -----------------------------------------------------------
	drawingPeanut(dataname);





	function drawingPeanut(d_nm) {
		//d3.area()활용 -----------------------------------------------------------------
		var g_area = svg.selectAll("g")
			.data(d_nm).enter().append("g").attr("transform", function () {return getPositionByIndex() });

		//콘텐츠 영역 확인 위한 rectArea element 추가
		var g_viewer = g_area.append("rect")
			.attr("width", initSizes.contentsArea.w).attr("height", initSizes.contentsArea.h)
			.attr("stroke", "aqua").attr("fill", "none");

		//Center Point로 이동하기 위한 <g> ==========================================
		var g_center = g_area.append("g")
			.attr("class", "g_center")
			.attr("transform", "translate(140,140)");
		//팔 ===================================================================
		var arms_left = g_center.append("path").attr("class", "arms").attr("d", function(d){
				var arms = getFeaturesPos(d, "arms_left");
				var A1 = { x: arms.x-20, y:arms.y +10},
					A2 = { x: arms.x -25, y: arms.y+30 },
					A3 = { x : arms.x - 37, y: arms.y+30},
					A4 = { x: arms.x- 36, y: arms.y+40 };

				// return "M" + arms.x  +","  + arms.y + " " +  (arms.x+50) + "," + arms.y;
				return "M" + (arms.x+8)  +","  + arms.y + " " +
					"L" + A1.x + "," + A1.y + " " + A2.x + "," + A2.y +  " " +
					"Q" + A3.x + "," + A3.y + " " + A4.x +"," + A4.y;

			});
		var arms_right = g_center.append("path").attr("class", "arms").attr("d", function(d) {
				// var arms = getFeaturesPos(d, "arms_m_right"); //for test : 무조건 팔을 가운데로
				var arms = getFeaturesPos(d, "arms_right");

				// yum(left)
				var A1 = { x: arms.x+20, y:arms.y -10},
					A2 = { x: arms.x +25, y: arms.y-30 },
					A3 = { x : arms.x + 37, y: arms.y-30},
					A4 = { x: arms.x+ 36, y: arms.y-40 };

				// return "M" + arms.x  +","  + arms.y + " " +  (arms.x+50) + "," + arms.y;
				return "M" + (arms.x-8) + "," + arms.y + " " +
					"L" + A1.x + "," + A1.y + " " + A2.x + "," + A2.y + " " +
					"Q" + A3.x + "," + A3.y + " " + A4.x + "," + A4.y;

			});


		//Legs(다리) =============================================================
		var leg_left = g_center.append("polyline").attr("points", function(d){
				var legs = getFeaturesPos(d, "legs_left");
				var legLength = d.legLength; //다리길이
				return legs.x + "," + legs.y + " " + legs.x + "," +
					(legs.y+ legLength) + " " + (legs.x-(initSizes.legs.instep)) + "," + (legs.y+legLength);
			}).attr("class", "legs");
		var leg_right = g_center.append("polyline").attr("points", function(d){
				var legs = getFeaturesPos(d, "legs_right");
				var legLength = d.legLength; //다리길이
				return legs.x + "," + legs.y + " " + legs.x + "," +
					(legs.y+legLength) + " " + (legs.x-(initSizes.legs.instep)) + "," + (legs.y+legLength);
			}).attr("class", "legs");

		//몸체 ===============================================================
		var bodyEl = g_center.append("path")
			.attr("class", function(d){ return getClassBySheet(d); })
			.attr("d", function (d) { return getPeanutByData(d); })
			.on("mouseover", function(d){
				console.log(getFeaturesLog(d, "eyes"));
			});

		//눈 ===============================================================
		var eyes_left = g_center.append("circle")
			.attr("r", initSizes.eyes.outRadius).attr("class", "eyes")
			.attr("cx", function(d){
				var eyesGap = scales.detail.eyegap(d.r_unconvincing)/2;
				return -(initSizes.eyes.outRadius+ eyesGap);
			}).attr("cy", function(d) { return getFeaturesPos(d, "eyes"); });

		var eyes_right = g_center.append("circle")
			.attr("r", initSizes.eyes.outRadius).attr("class", "eyes")
			.attr("cx", function(d){
				var eyesGap = scales.detail.eyegap(d.r_unconvincing)/2;
				return initSizes.eyes.outRadius+ eyesGap;
			}).attr("cy", function(d){
				var eyesGap = scales.detail.eyegap(d.r_unconvincing)/2;
				return getFeaturesPos(d, "eyes");
			});


		//Pupil(눈동자) =============================================================
		var pupil_left = g_center.append("circle")
			.attr("r", initSizes.eyes.inRadius).attr("class", "pupil").attr("transform", function(d){
				//a, b값의 비율을 통해 type(frameA, frameB, frameC)을 얻는다.
				var eyesGap = scales.detail.eyegap(d.r_unconvincing)/2;
				var eyesX =-( initSizes.eyes.outRadius+ eyesGap);
				var eyesY = getFeaturesPos(d, "eyes");

				return "translate(" +  eyesX + "," + eyesY + ")";
			});

		var pupil_right = g_center.append("circle")
			.attr("r", initSizes.eyes.inRadius).attr("class", "pupil").attr("transform", function(d){
				//a, b값의 비율을 통해 type(frameA, frameB, frameC)을 얻는다.
				var eyesGap = scales.detail.eyegap(d.r_unconvincing)/2;
				var eyesX = initSizes.eyes.outRadius+ eyesGap;
				var eyesY = getFeaturesPos(d, "eyes");

				return "translate(" +  eyesX + "," + eyesY + ")";
			});



		// 입
		var mouth = g_center.append("rect")
			.attr("width",initSizes.mouth.w)
			.attr("height", initSizes.mouth.h)
			.attr("class", "mouth")
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("x", - initSizes.mouth.w/2)
			.attr("y", function(d) { return getFeaturesPos(d, "eyes")+14; });

		//Add check point, text : 체크포인트, 텍스트를 추가한다. ==================================
		// var checkMate = checkPointer(d_nm, g_center);


		//Character Alignment : bottom 기준  ==============================================
		g_center.attr("transform", function(d){
			var contentHeight = initSizes.contentsArea.h; //280
			var characterHeight = (d.a7.y + d.legLength);
			// 각 콘텐츠 별 가장 아래 지점(발 위치지점)을 가지고 캐릭터 영역(g_area)의 bottom영역까지의 거리를 구한 뒤, 추가로 이동한다.
			// 쉽게말해, 모든 요소를 그린뒤, 각 캐릭터별 길이가 다르므로, 땅까지의 모자란 정도를 구해서 추가로 이동해주는 것이다. like gravity
			var moveY = contentHeight - characterHeight;
			return "translate(140," + moveY + ")";
		});

		// console.log(g_center[0][0].getBBox());
		// console.log(g_center[0].getBBox());
		// console.log(g_center[0].getBBox());

		// console.log(pathMouth[0][0].getBBox());

	}


}

function checkPointer(d, appendObj){
	//check point for test ----------------------------------------------------------------------------------------------------------------------------------------
	var check_text = appendObj.append("g").append("g").attr("class", "check_text").style("fill", "black").style("font-size", 12);
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a1.x + "," + d.a1.y + ")"; }).text("a1");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a2.x + "," + d.a2.y + ")"; }).text("a2");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a3.x + "," + d.a3.y + ")"; }).text("a3");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a4.x + "," + d.a4.y + ")"; }).text("a4");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a5.x + "," + d.a5.y + ")"; }).text("a5");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a6.x + "," + d.a6.y + ")"; }).text("a6");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a7.x + "," + d.a7.y + ")"; }).text("a7");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a8.x + "," + d.a8.y + ")"; }).text("a8");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a9.x + "," + d.a9.y + ")"; }).text("a9");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a10.x + "," + d.a10.y + ")"; }).text("a10");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a11.x + "," + d.a11.y + ")"; }).text("a11");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a12.x + "," + d.a12.y + ")"; }).text("a12");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a13.x + "," + d.a13.y + ")"; }).text("a13");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a14.x + "," + d.a14.y + ")"; }).text("a14");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a15.x + "," + d.a15.y + ")"; }).text("a15");
	check_text.append("text").attr("transform", function(d){ return "translate(" + d.a16.x + "," + d.a16.y + ")"; }).text("a16");

	//check point for test ----------------------------------------------------------------------------------------------------------------------------------------
	var check_point = appendObj.append("g").append("g").attr("class", "check_point").style("fill", "darkorange");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a1.x + "," + d.a1.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a2.x + "," + d.a2.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a3.x + "," + d.a3.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a4.x + "," + d.a4.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a5.x + "," + d.a5.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a6.x + "," + d.a6.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a7.x + "," + d.a7.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a8.x + "," + d.a8.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a9.x + "," + d.a9.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a10.x + "," + d.a10.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a11.x + "," + d.a11.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a12.x + "," + d.a12.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a13.x + "," + d.a13.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a14.x + "," + d.a14.y + ")"; });
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a15.x + "," + d.a15.y + ")"; }).style("fill", "darkmagenta");
	check_point.append("circle").attr("r", "2").attr("transform", function(d){ return "translate(" + d.a16.x + "," + d.a16.y + ")"; });
}



//눈코입의 위치를 getPeanut 알고리즘에서 계산한다. ===========================================
function getFeaturesPos(d, featureName) {
	var resultPosValues; //최종 리턴 변수

	//feature 이름에 따라 계산식을 다르게 부여(신체부위마다 위치계산법이 다르기 때문)
	switch(featureName){
		case "eyes":
			resultPosValues = getEyePosY(d);
			break;
		case "legs_left":
			resultPosValues = getLegPos(d, "legs_left");
			break;
		case "legs_right":
			resultPosValues = getLegPos(d, "legs_right");
			break;
		case "arms_left":
			resultPosValues = getArmPos_left(d);
			break;
		case "arms_right":
			resultPosValues = getArmPos_right(d);
			break;
		default:
			resultPosValues = getEyePosY(d);
			break;
	}
	//최종 return value. ***
	return resultPosValues;

	//눈 위치 얻기
	function getEyePosY(d){
		var typeByPer= getRatio(d.w1, d.w3);
		return (d.sheetType === "sheet2")? typeSheet2() : typeSheet3();

		function typeSheet2(){
			if(typeByPer === "typeA"){ return d.a4.y; } //w1 == w3  :middle
			if(typeByPer === "typeB"){ return d.a2.y; } // w1 >w3 : top
			if(typeByPer === "typeC"){ return d.a6.y; } // w1 <w3 : bottom
		}
		function typeSheet3(){
			if(typeByPer === "typeA"){ return d.a2.y; } //w1 == w3  :top
			if(typeByPer === "typeB"){ return d.a2.y; } // w1 >w3 : top
			if(typeByPer === "typeC"){ return d.a6.y; } // w1 <w3 : bottom
		}
	}
	// 다리위치 얻기
	function getLegPos(d, dir){
		var resultLegPos = {};
		var criticalmass_leg = initSizes.legs.depth; //w1, w3모두 200이 넘으면 발동
		var legGap = criticalmass_leg * initSizes.legs.legGaps;
		var splitDir = dir.split("_")[1];

		return (splitDir === "left")? legTypeLeft() : legTypeRight();

		//왼발
		function legTypeLeft(){
			if( (d.w1 > criticalmass_leg ) && (d.w3 > criticalmass_leg) ){
				resultLegPos.x = d.a7.x - legGap; //200둘다 넘는 애들에게만 10px 추가 부여
				resultLegPos.y = Math.abs(d.a7.y) -10;
			}else{
				var legGapControl = scales.legGap(d.w3);
				resultLegPos.x = (d.widthType === "typeC")? 10 : d.a7.x + legGapControl;
				resultLegPos.y = Math.abs(d.a7.y) -10;
			}
			return resultLegPos;
		}
		//오른발
		function legTypeRight(){
			if( (d.w1 > criticalmass_leg ) && (d.w3 > criticalmass_leg) ){
				resultLegPos.x = d.a9.x +legGap; //200둘다 넘는 애들에게만 10px 추가 부여
				resultLegPos.y = Math.abs(d.a9.y) -10;
			} else{
				var legGapControl = scales.legGap(d.w3);
				resultLegPos.x = (d.widthType === "typeC")? -10 : d.a9.x - legGapControl;
				resultLegPos.y = Math.abs(d.a9.y) -10;
			}
			return resultLegPos;
		}
		return resultLegPos;
	}
	//오른손
	function getArmPos_right(d){
		var resultArmpos = {};
		return (d.sheetType === "sheet2")? typeSheet2_arm() : typeSheet3_arm();

		function typeSheet2_arm(){
			var typeByPer = getRatio(d.w1, d.w3); //"typeA"

			switch(typeByPer) {
				//type A : w1===w3 , typeB: w1>w3, typeC : w1 <w
				//middle
				case "typeA":
					resultArmpos.x = d.a13.x;
					resultArmpos.y = d.a13.y;
					break;
				//top
				case "typeB":
					resultArmpos.x = d.a13.x;
					resultArmpos.y = d.a13.y;
					break;
				//bottom
				case "typeC":
					resultArmpos.x = d.a9.x;
					resultArmpos.y = d.a9.y;
					break;
				default:
					console.log("no-type");
					resultArmpos.x = d.a9.x;
					resultArmpos.y = d.a9.y;
					break;
			}

			return resultArmpos;
		}
		function typeSheet3_arm(){
			var typeByPer = getRatio(d.w1, d.w3); //"typeA"
			switch(typeByPer) {
				//top
				case "typeA":
					resultArmpos.x = d.a13.x;
					resultArmpos.y = d.a13.y;
					break;
				//top
				case "typeB":
					resultArmpos.x =d.a13.x;
					resultArmpos.y = d.a13.y;
					break;
				//bottom
				case "typeC":
					resultArmpos.x = d.a9.x;
					resultArmpos.y = d.a9.y;
					break;
				default:
					console.log("no-type");
					resultArmpos.x = d.a9.x;
					resultArmpos.y = d.a9.y;
					break;
			}
			return resultArmpos;
		}
	}
	//왼손
	function getArmPos_left(d){
		var resultArmpos = {};
		return (d.sheetType === "sheet2")? typeSheet2_arm(d) : typeSheet3_arm(d);
		function typeSheet2_arm(){
			var typeByPer = getRatio(d.w1, d.w3); //"typeA"
			switch(typeByPer) {
				//type A : w1===w3 , typeB: w1>w3, typeC : w1 <w3
				//middle
				case "typeA":
					resultArmpos.x = d.a3.x;
					resultArmpos.y = d.a3.y;
					break;
				//top
				case "typeB":
					resultArmpos.x = d.a3.x;
					resultArmpos.y = d.a3.y;
					break;
				//bottom
				case "typeC":
					resultArmpos.x = d.a7.x;
					resultArmpos.y = d.a7.y;
					break;
				default:
					console.log("no-type");
					resultArmpos.x = d.a7.x;
					resultArmpos.y = d.a7.y;
					resultArmpos.y = d.a7.y;
					break;
			}
			return resultArmpos;
		}
		function typeSheet3_arm(d){
			var typeByPer = getRatio(d.w1, d.w3); //"typeA"
			switch(typeByPer) {
				//top
				case "typeA":
					resultArmpos.x = d.a3.x;
					resultArmpos.y = d.a3.y;
					break;
				//top
				case "typeB":
					resultArmpos.x = d.a3.x;
					resultArmpos.y = d.a3.y;
					break;
				//bottom
				case "typeC":
					resultArmpos.x = d.a7.x;
					resultArmpos.y = d.a7.y;
					break;
				default:
					console.log("no-type");
					resultArmpos.x = d.a7.x;
					resultArmpos.y = d.a7.y;
					break;
			}
			return resultArmpos;
		}
	}

} // END - getFeaturesPos()

function getRatio(w1, w3){
	var per = w1/w3 * 100; //w1 = w3 이면 100 , w1 > w3 이면 100보다 큰 수, w1 < w3 이면 100보다 작은 수
	if( ( 0 <= per) && ( per < 80 ) ){ return "typeC"; } //w1 < w3 : bottom
	else if( ( 80 <= per ) && ( per < 120) ) {  return "typeA"; } //w1 == w3 : top
	else { return "typeB";  } //w1 > w3 : top
}

//getPeanut ==============================================================
function getPeanutByData(d) {
	//MoveTo
	var MV = "M" + d.a1.x + "," + d.a1.y;
	//Quadratics
	var Q1 = " Q " + d.a2.x + "," + d.a2.y + " " +  d.a3.x + "," + d.a3.y , Q2 = " Q " +  d.a4.x + "," + d.a4.y + " " +  d.a5.x + "," + d.a5.y , Q3 = " Q " +  d.a6.x + "," + d.a6.y + " " +  d.a7.x + "," + d.a7.y , Q4 = " Q " +  d.a8.x + "," + d.a8.y + " " +  d.a9.x + "," + d.a9.y , Q5 = " Q " +  d.a10.x + "," + d.a10.y + " " +  d.a11.x + "," + d.a11.y ,Q6 = " Q " +  d.a12.x + "," + d.a12.y + " " +  d.a13.x + "," + d.a13.y , Q7 = " Q " +  d.a14.x + "," + d.a14.y + " " +  d.a15.x + "," + d.a15.y ,Q8 = " Q " +  d.a16.x + "," + d.a16.y + " " +  d.a1.x + "," + d.a1.y ;
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


//눈코입의 위치를 getPeanut 알고리즘에서 계산한다. ===========================================
function getClassBySheet(d){
	var h1 =  scales.t.h1(d.r_informative);
	var h2 = 200-(scales.t.h1(d.r_informative));
	var checkSheetTypes = (h1 < h2 === true)? "sheet2" : "sheet3"; //h1>h2 크기 비교후 sheet 타입 나눈다.
	return (checkSheetTypes === "sheet2")? "sheetType2" : "sheetType3";
}

// 기울기 계산 후 Quadratic 객체 생성함수  --------------------------------------------------
function computeTilt(width, height, middleWidth){
	//size attributes
	var  a = width/2, b = height/2, c = middleWidth/2; //middle width''
	//compute quadratic bezier curve point (x, y)
	var  a1  = { x:-a/2, y:-3*b/4 },  a2 = { x:-a, y:-b/2 },  a3 = { x:-(a+c)/2, y:-b/4 },  a4 = { x:-c, y:0},  a5 = { x:-(a+c)/2, y:b/4 },  a6 = { x:-a, y:b/2},  a7 = { x:-a/2, y:3*b/4 },  a8 = { x:0, y:b },  a9 = { x:a/2, y:3*b/4},  a10 = { x:a, y:b/2 },  a11 = { x:(a+c)/2, y:b/4},  a12 = { x:c, y:0 },  a13 = { x:(a+c)/2, y:-b/4 },  a14 = { x:a, y:-b/2 },  a15 = { x:a/2, y:-3*b/4 }, a16 = { x:0, y:-b};
	//MoveTo
	var MV = "M" + a1.x + "," + a1.y;
	//Quadratics
	var Q1 = " Q " + a2.x + "," + a2.y + " " +  a3.x + "," + a3.y , Q2 = " Q " +  a4.x + "," + a4.y + " " +  a5.x + "," + a5.y , Q3 = " Q " +  a6.x + "," + a6.y + " " +  a7.x + "," + a7.y , Q4 = " Q " +  a8.x + "," + a8.y + " " +  a9.x + "," + a9.y , Q5 = " Q " +  a10.x + "," + a10.y + " " +  a11.x + "," + a11.y , Q6 = " Q " +  a12.x + "," + a12.y + " " +  a13.x + "," + a13.y , Q7 = " Q " +  a14.x + "," + a14.y + " " +  a15.x + "," + a15.y ,Q8 = " Q " +  a16.x + "," + a16.y + " " +  a1.x + "," + a1.y ;
	//return values
	return MV + Q1 + Q2 + Q3 + Q4 + Q5 + Q6 + Q7+ Q8;
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

//눈코입의 위치를 getPeanut 알고리즘에서 계산한다.
function getFeaturesLog(d, featureName) {
	var resultPosValues; //최종 리턴 변수

	var h1 =  scales.t.h1(d.r_informative),
		h2 = 200-(scales.t.h1(d.r_informative)),
		w1= scales.t.w1(d.r_beautiful),
		w2,
		w3= scales.t.w3(d.r_courageous),
		a = d.randomA, b = d.randomB;

	var checkSheetTypes = (h1 < h2 === true)? "sheet2" : "sheet3"; //h1>h2 크기 비교후 sheet 타입 나눈다.



	//Set w2 value's Range (based on w1, w3)
	if(w1 < w3){ scales.t.w2.range([1, w1]); w2 = scales.t.w2(d.r_inspiring); }
	else { scales.t.w2.range([1, w3 ]); w2 = scales.t.w2(d.r_inspiring); }

	//Variable Assignment for quadratic bezier curve point (x, y) ***
	var t0 = a + b, t1 = a + 2 * b,  t2 = 2 * a + b,  t3 = 2 * (a + b),  t4 = w1 - w2,  t5 = w3 - w2;

	//compute quadratic bezier curve point (x, y)
	var  a1  = { x: -(b*w1)/t3 , y:-(t2*h1)/t3 },  a2 = { x: -(w1)/2, y:-(h1)/2 },  a3 = { x: -(w2*t0+a*t4)/t3, y: -(h1*a)/t3 },  a4 = { x: -w2/2, y:0},
		a5 = { x: -(w2*t0+t5*b)/t3, y: (b*h2)/t3}, a6 = { x: -w3/2, y:h2/2}, a7 = { x: -(a*w3)/t3, y:(t1*h2)/t3 },  a8 = { x:0, y:h2 },
		a9 = { x: (a*w3)/t3, y: (t1*h2)/t3},  a10 = { x: w3/2, y:h2/2 },  a11 = { x: (w2*t0+t5*b)/t3, y:(b*h2)/t3},  a12 = { x: w2/2, y:0 },
		a13 = { x: (w2*t0+a*t4)/t3, y:-(h1*a)/t3 },  a14 = { x: w1/2, y: -h1/2 },  a15 = { x: b*w1/t3, y: -(t2*h1)/t3 },  a16 = { x: 0, y:-h1};

	//feature 이름에 따라 계산식을 다르게 부여(신체부위마다 위치계산법이 다르기 때문)
	switch(featureName){
		case "eyes":
			resultPosValues = getEyePosY(w1,w3, checkSheetTypes);
			break;
		default:
			resultPosValues = getEyePosY(w1,w3, checkSheetTypes);
			break;
	}
	return resultPosValues; //최종 return value.




	//get Eye Position Y
	function getEyePosY(ratio_w1, ratio_w3, s_type){
		var percents = ratio_w1/ratio_w3*100;
		//w1 = w3 이면 100
		//w1 > w3 이면 100보다 큰 수
		//w1 < w3 이면 100보다 작은 수

		return (s_type === "sheet2")? typeSheet2() : typeSheet3();

		function typeSheet2(){
			if( ( 0 <= percents) && ( percents < 80 ) ){ return "sheet2(blue), w1(" + ratio_w1 +" ) < w3("+ratio_w3+"), and set bottom(a4)"; }
			else if( ( 80 <= percents ) && ( percents < 120) ) {  return "sheet2(blue), w1(" + ratio_w1 +" ) = w3("+ratio_w3+") and set middle(a3)"; }
			else { return "sheet2(blue), w1(" + ratio_w1 +" ) > w3("+ratio_w3+"),  and set top(a2)"; }
		}

		function typeSheet3(){
			if( ( 0 <= percents) && ( percents < 80 ) ){ return "sheet3(green), w1(" + ratio_w1 +" ) < w3("+ratio_w3+"), and set bottom(a4)"; }
			else if( ( 80 <= percents ) && ( percents < 120) ) {  return "sheet3(green), w1(" + ratio_w1 +" ) = w3("+ratio_w3+"), and set top(a2)"; }
			else { return "sheet3(green), w1(" + ratio_w1 +" ) > w3("+ratio_w3+"), and set top(a2)"; }
		}

	}

} // END - getFeaturesPos()

