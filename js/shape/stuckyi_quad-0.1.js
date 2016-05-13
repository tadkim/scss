/**
 * Created by admin on 2016. 5. 6..
 */


var svgSize = {w:1280, h:13960};
var svgTestSize = {w:6080, h:400};
var svgMargin = { top:30, right: 30, bottom: 30, left:30};
var characterMargin = {top:10, right: 10, bottom: 10, left:10};
var t = 1, indexCounter=0, xPos = svgMargin.left;

//콘텐츠 기본영역 설정
var initSizes = {
	contentsArea : {w:280, h:280},
	mouth :{ w:40, h:20 },
	mouth_inner :{ w:40, h:10 }
};
//콘텐츠 변수 별 스케일 설정
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
		h1:d3.scale.linear().range([80,200]),
		h2:d3.scale.linear().range([30,250]),
		w1:d3.scale.linear().range([80, 280]),
		w2:d3.scale.linear().range([20, 280]),
		w3:d3.scale.linear().range([80, 280]),
		a:d3.scale.linear().range([1, 3]),
		b:d3.scale.linear().range([1, 3])
	}

};


var yPos  = 100;
var yGap  = 280;

// SVG 생성
// var svg = d3.select("#d3area").append("svg").attr("width", svgSize.w).attr("height", svgSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");

for(var index = 0; index < 135; index++){
	var idselector = "#test"+index;
	d3.select(idselector).append("svg").attr("class","svg_"+ index).attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
}
/*
svg1 = d3.select("#test1").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg2 = d3.select("#test2").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg3 = d3.select("#test3").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg4 = d3.select("#test4").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg5 = d3.select("#test5").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg6 = d3.select("#test6").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg7 = d3.select("#test7").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg8 = d3.select("#test8").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg9 = d3.select("#test9").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg10 = d3.select("#test10").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg11 = d3.select("#test11").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg12 = d3.select("#test12").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
var svg13 = d3.select("#test13").append("svg").attr("width", svgTestSize.w).attr("height", svgTestSize.h).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
*/


//Load Data
d3.tsv("data/ted_0.5_test_one.tsv", function(error, dataset) {
// d3.tsv("data/ted_0.5_all.tsv", function(error, dataset) {
	if (error) { console.log("Data Loading ERROR"); }

	//type assignment
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

	});

	//Scale set function
	setDomainByData(dataset); // 데이터셋 기반으로 scale의 domain 값을 설정한다

	//데이터 셋 필터링
	dataset = dataset.filter(function(element){ return element.Beautiful > 2000; });

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


	// drawTheme_test(dataname, ".svg_1", 100, 100, 200, 100, 20, 1, 1); //drawTheme_test(data, svgname, h1, h2, w1, w2, w3, a, b);
	drawTheme_test(dataname,'.svg_0',100,100,200,20,200,1,1);
	drawTheme_test(dataname,'.svg_1',100,100,200,60,200,1,1);
	drawTheme_test(dataname,'.svg_2',100,100,200,100,200,1,1);
	drawTheme_test(dataname,'.svg_3',100,100,200,140,200,1,1);
	drawTheme_test(dataname,'.svg_4',100,100,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_5',200,200,200,20,200,1,1);
	drawTheme_test(dataname,'.svg_6',200,200,200,60,200,1,1);
	drawTheme_test(dataname,'.svg_7',200,200,200,100,200,1,1);
	drawTheme_test(dataname,'.svg_8',200,200,200,140,200,1,1);
	drawTheme_test(dataname,'.svg_9',200,200,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_10',300,300,200,20,200,1,1);
	drawTheme_test(dataname,'.svg_11',300,300,200,60,200,1,1);
	drawTheme_test(dataname,'.svg_12',300,300,200,100,200,1,1);
	drawTheme_test(dataname,'.svg_13',300,300,200,140,200,1,1);
	drawTheme_test(dataname,'.svg_14',300,300,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_15',100,100,200,20,40,1,1);
	drawTheme_test(dataname,'.svg_16',100,100,200,60,80,1,1);
	drawTheme_test(dataname,'.svg_17',100,100,200,100,140,1,1);
	drawTheme_test(dataname,'.svg_18',100,100,200,140,180,1,1);
	drawTheme_test(dataname,'.svg_19',100,100,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_20',200,200,200,20,40,1,1);
	drawTheme_test(dataname,'.svg_21',200,200,200,60,80,1,1);
	drawTheme_test(dataname,'.svg_22',200,200,200,100,140,1,1);
	drawTheme_test(dataname,'.svg_23',200,200,200,140,180,1,1);
	drawTheme_test(dataname,'.svg_24',200,200,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_25',300,300,200,20,40,1,1);
	drawTheme_test(dataname,'.svg_26',300,300,200,60,80,1,1);
	drawTheme_test(dataname,'.svg_27',300,300,200,100,140,1,1);
	drawTheme_test(dataname,'.svg_28',300,300,200,140,180,1,1);
	drawTheme_test(dataname,'.svg_29',300,300,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_30',100,100,40,20,200,1,1);
	drawTheme_test(dataname,'.svg_31',100,100,80,60,200,1,1);
	drawTheme_test(dataname,'.svg_32',100,100,120,100,200,1,1);
	drawTheme_test(dataname,'.svg_33',100,100,180,140,200,1,1);
	drawTheme_test(dataname,'.svg_34',100,100,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_35',200,200,40,20,200,1,1);
	drawTheme_test(dataname,'.svg_36',200,200,80,60,200,1,1);
	drawTheme_test(dataname,'.svg_37',200,200,120,100,200,1,1);
	drawTheme_test(dataname,'.svg_38',200,200,180,140,200,1,1);
	drawTheme_test(dataname,'.svg_39',200,200,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_40',300,300,40,20,200,1,1);
	drawTheme_test(dataname,'.svg_41',300,300,80,60,200,1,1);
	drawTheme_test(dataname,'.svg_42',300,300,120,100,200,1,1);
	drawTheme_test(dataname,'.svg_43',300,300,180,140,200,1,1);
	drawTheme_test(dataname,'.svg_44',300,300,200,180,200,1,1);
	drawTheme_test(dataname,'.svg_45',100,100,200,20,200,1,3);
	drawTheme_test(dataname,'.svg_46',100,100,200,60,200,1,3);
	drawTheme_test(dataname,'.svg_47',100,100,200,100,200,1,3);
	drawTheme_test(dataname,'.svg_48',100,100,200,140,200,1,3);
	drawTheme_test(dataname,'.svg_49',100,100,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_50',200,200,200,20,200,1,3);
	drawTheme_test(dataname,'.svg_51',200,200,200,60,200,1,3);
	drawTheme_test(dataname,'.svg_52',200,200,200,100,200,1,3);
	drawTheme_test(dataname,'.svg_53',200,200,200,140,200,1,3);
	drawTheme_test(dataname,'.svg_54',200,200,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_55',300,300,200,20,200,1,3);
	drawTheme_test(dataname,'.svg_56',300,300,200,60,200,1,3);
	drawTheme_test(dataname,'.svg_57',300,300,200,100,200,1,3);
	drawTheme_test(dataname,'.svg_58',300,300,200,140,200,1,3);
	drawTheme_test(dataname,'.svg_59',300,300,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_60',100,100,200,20,40,1,3);
	drawTheme_test(dataname,'.svg_61',100,100,200,60,80,1,3);
	drawTheme_test(dataname,'.svg_62',100,100,200,100,140,1,3);
	drawTheme_test(dataname,'.svg_63',100,100,200,140,180,1,3);
	drawTheme_test(dataname,'.svg_64',100,100,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_65',200,200,200,20,40,1,3);
	drawTheme_test(dataname,'.svg_66',200,200,200,60,80,1,3);
	drawTheme_test(dataname,'.svg_67',200,200,200,100,140,1,3);
	drawTheme_test(dataname,'.svg_68',200,200,200,140,180,1,3);
	drawTheme_test(dataname,'.svg_69',200,200,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_70',300,300,200,20,40,1,3);
	drawTheme_test(dataname,'.svg_71',300,300,200,60,80,1,3);
	drawTheme_test(dataname,'.svg_72',300,300,200,100,140,1,3);
	drawTheme_test(dataname,'.svg_73',300,300,200,140,180,1,3);
	drawTheme_test(dataname,'.svg_74',300,300,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_75',100,100,40,20,200,1,3);
	drawTheme_test(dataname,'.svg_76',100,100,80,60,200,1,3);
	drawTheme_test(dataname,'.svg_77',100,100,120,100,200,1,3);
	drawTheme_test(dataname,'.svg_78',100,100,180,140,200,1,3);
	drawTheme_test(dataname,'.svg_79',100,100,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_80',200,200,40,20,200,1,3);
	drawTheme_test(dataname,'.svg_81',200,200,80,60,200,1,3);
	drawTheme_test(dataname,'.svg_82',200,200,120,100,200,1,3);
	drawTheme_test(dataname,'.svg_83',200,200,180,140,200,1,3);
	drawTheme_test(dataname,'.svg_84',200,200,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_85',300,300,40,20,200,1,3);
	drawTheme_test(dataname,'.svg_86',300,300,80,60,200,1,3);
	drawTheme_test(dataname,'.svg_87',300,300,120,100,200,1,3);
	drawTheme_test(dataname,'.svg_88',300,300,180,140,200,1,3);
	drawTheme_test(dataname,'.svg_89',300,300,200,180,200,1,3);
	drawTheme_test(dataname,'.svg_90',100,100,200,20,200,3,1);
	drawTheme_test(dataname,'.svg_91',100,100,200,60,200,3,1);
	drawTheme_test(dataname,'.svg_92',100,100,200,100,200,3,1);
	drawTheme_test(dataname,'.svg_93',100,100,200,140,200,3,1);
	drawTheme_test(dataname,'.svg_94',100,100,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_95',200,200,200,20,200,3,1);
	drawTheme_test(dataname,'.svg_96',200,200,200,60,200,3,1);
	drawTheme_test(dataname,'.svg_97',200,200,200,100,200,3,1);
	drawTheme_test(dataname,'.svg_98',200,200,200,140,200,3,1);
	drawTheme_test(dataname,'.svg_99',200,200,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_100',300,300,200,20,200,3,1);
	drawTheme_test(dataname,'.svg_101',300,300,200,60,200,3,1);
	drawTheme_test(dataname,'.svg_102',300,300,200,100,200,3,1);
	drawTheme_test(dataname,'.svg_103',300,300,200,140,200,3,1);
	drawTheme_test(dataname,'.svg_104',300,300,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_105',100,100,200,20,40,3,1);
	drawTheme_test(dataname,'.svg_106',100,100,200,60,80,3,1);
	drawTheme_test(dataname,'.svg_107',100,100,200,100,140,3,1);
	drawTheme_test(dataname,'.svg_108',100,100,200,140,180,3,1);
	drawTheme_test(dataname,'.svg_109',100,100,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_110',200,200,200,20,40,3,1);
	drawTheme_test(dataname,'.svg_111',200,200,200,60,80,3,1);
	drawTheme_test(dataname,'.svg_112',200,200,200,100,140,3,1);
	drawTheme_test(dataname,'.svg_113',200,200,200,140,180,3,1);
	drawTheme_test(dataname,'.svg_114',200,200,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_115',300,300,200,20,40,3,1);
	drawTheme_test(dataname,'.svg_116',300,300,200,60,80,3,1);
	drawTheme_test(dataname,'.svg_117',300,300,200,100,140,3,1);
	drawTheme_test(dataname,'.svg_118',300,300,200,140,180,3,1);
	drawTheme_test(dataname,'.svg_119',300,300,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_120',100,100,40,20,200,3,1);
	drawTheme_test(dataname,'.svg_121',100,100,80,60,200,3,1);
	drawTheme_test(dataname,'.svg_122',100,100,120,100,200,3,1);
	drawTheme_test(dataname,'.svg_123',100,100,180,140,200,3,1);
	drawTheme_test(dataname,'.svg_124',100,100,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_125',200,200,40,20,200,3,1);
	drawTheme_test(dataname,'.svg_126',200,200,80,60,200,3,1);
	drawTheme_test(dataname,'.svg_127',200,200,120,100,200,3,1);
	drawTheme_test(dataname,'.svg_128',200,200,180,140,200,3,1);
	drawTheme_test(dataname,'.svg_129',200,200,200,180,200,3,1);
	drawTheme_test(dataname,'.svg_130',300,300,40,20,200,3,1);
	drawTheme_test(dataname,'.svg_131',300,300,80,60,200,3,1);
	drawTheme_test(dataname,'.svg_132',300,300,120,100,200,3,1);
	drawTheme_test(dataname,'.svg_133',300,300,180,140,200,3,1);
	drawTheme_test(dataname,'.svg_134',300,300,200,180,200,3,1);


	// drawTheme_test(dataname, svg2);

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
				var h1Val = scales.t.h1(d.Beautiful);
				var h2Val = 280 - h1Val;
				if(h2Val === 0){
					console.log("0!!!");
					h2Vale = 30;
				}
				console.log(h1Val +", " + h2Val);
				// return getPeanut(200, 100, 150, 30, 90, 1, 1);

				var w2Val = (scales.t.w1(d.OK) > scales.t.w3(d.posPer))? scales.t.w3(d.posPer) : scales.t.w1(d.OK);


				console.log(Math.abs(scales.t.w1(d.OK)-scales.t.w3(d.posPer)));

				return getPeanut(
					h1Val,
					h2Val,
					scales.t.w1(d.OK),
					w2Val-30,
					scales.t.w3(d.posPer),
					1,
					1
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

	function drawTheme_test(d_nm, svg_nm, th1, th2, tw1, tw2, tw3, tra, trb) {



		//d3.area()활용 -----------------------------------------------------------------
		var g_area = d3.select(svg_nm).selectAll("g")
		// var g_area = svg_nm.selectAll("g")
			.data(d_nm).enter().append("g").attr("transform", function (d,i) {
				if(i === 0){ xPos = svgMargin.left; }
				else{ xPos = xPos += 300; }
				return "translate(" + xPos + "," + yPos + ")";
				// return getPositionByIndex();
			});

		//콘텐츠 영역 확인 위한 rectArea element 추가
		var g_viewer = g_area.append("rect")
			.attr("width", initSizes.contentsArea.w).attr("height", initSizes.contentsArea.h)
			.attr("stroke", "aqua").attr("fill", "none");

		var g_center = g_area.append("g").attr("transform", "translate(140,140)");

		//몸체 ===============================================================
		var bodyEl = g_center.append("path")
			.attr("d", function (d) { return getPeanut(th1, th2, tw1, tw2, tw3, tra, trb); });

		/*

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
			*/

		// test only
		var setValues = g_area.append("text")
			.style("fill", "white")
			.attr("class", "test-text")
			.text("getPeanut(" + th1 + ", " +  th2 + ", " +  tw1 + ", " + tw2 + ", " + tw3 + ", "  + tra + ", " + trb + ")" );



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
			indexCounter = 0;
			yPos = yPos + yGap;
			resultPos =  "translate(30," + yPos + ")";
			break;
		default:
			resultPos = "translate(30," + yPos + ")";
			break;
	}
	return resultPos;
} // 콘텐츠 별 위치 결정 함수

function getPositionForTest(){
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
} // 콘텐츠 별 위치 결정 함수
