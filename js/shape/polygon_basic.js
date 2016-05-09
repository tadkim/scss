/**
 * Created by admin on 2016. 5. 6..
 */

var svgSize = {w:900, h:500};
var svgMargin = { top:10, right: 10, bottom: 10, left:10};


var svg = d3.select("#d3area").append("svg")
	.attr("width", svgSize.w)
	.attr("height", svgSize.h)
	.attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");


var group = svg.append("g");

var polygons = group.append("polyline")
	.style("stroke", "yellow")  // colour the line
	.style("fill", "none")     // remove any fill colour
	.attr("points", drawPolygon(4, 500, 500, 100));  // x,y points
// .attr("points", "100,50,200,150,300,50");  // x,y points (default)

var anicounter  = 1;
var segArray = [4, 8, 16, 32, 64, 128, 256, 360];

function changeFunction() {
	setTimeout(function(){
		anicounter = anicounter+1;
		polygons.attr("points", drawPolygon(segArray[anicounter], 500, 500, 100));
	}, 3000);
}

function drawPolygon(segCount, pw, ph, radius){
	// var resultArray = [pw/2, ph/2];
	var resultArray = [];
	var angleStep = 360/segCount;
	for(var angle = 0; angle < 360; angle += angleStep){
		var vx = pw/2 + Math.cos(degToRadians(angle)) * radius;
		var vy = ph/2 + Math.sin(degToRadians(angle)) * radius;
		//계산 한 위치를 배열에 추가
		resultArray.push(vx);
		resultArray.push(vy);
	}

	return resultArray.join(",");
}

// Converts from degrees to radians.
function degToRadians(degrees){
	return degrees * Math.PI / 180;
}