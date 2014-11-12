var TO_METER = 100;//100 pixels = 1 metro
var cosMulti = 100;
var current = 0;

var vSlider;
var kSlider;

var v = 1;//1 a 3
var k = 2;//1 a 3
var t = 0;//tempo da animação

var circle = {
	center: {
		x: 0 * TO_METER,
		y: 3 * TO_METER
	},
	angle: 0,
	ray: 1 * TO_METER,
	graph: null,
	arrow: null,
	vertical: null
}

var btnPlayPause;
var paused = false;
var mouseDown = false;
var btnReset;

var raphael;
var graph = {
	center: {
		x:0,
		y:circle.center.y
	},
	graph: null,
	axis: null
};

function init(){
	btnPlayPause = $("#playPause");
	btnReset = $("#reset");

	raphael = Raphael("raphael");

	graph.axis = raphael.path("M0," + graph.center.y + "L" + $("#raphael").width() + "," + graph.center.y).attr({"stroke-width": "2", "stroke": "#000"});
	graph.graph = raphael.path("M0,0").attr({"stroke-width": "1", "stroke": "#00F"});
	updateGraph();

	circle.graph = raphael.circle(circle.center.x, circle.center.y, circle.ray).attr({"stroke-width": "3", "stroke": "#000", "fill": "#99F", opacity: 0.5});
	circle.vertical = raphael.path("M" + circle.center.x + "," + (circle.center.y - circle.ray) + "L" + circle.center.x + "," + (circle.center.y + circle.ray)).attr({"stroke-width": "1", "stroke": "#0000FF"});
	circle.arrow = raphael.path("M0,0").attr({"stroke-width": "3", "stroke": "#FF0000", fill:"#FF0000"});
	//drawArrow();

	vSlider = new Dragdealer('vSlider', {slide:false, steps:3, snap:true, x:0, animationCallback: vMoving});
	kSlider = new Dragdealer('kSlider', {slide:false, steps:3, snap:true, x:0.5, animationCallback: kMoving});

	btnPlayPause.on("click", playPause);
	btnReset.on("click", reset);

	circle.graph.mousedown(fmd);
	
	requestAnimationFrame(update);
}

var mousePos = {
	x:0,
	y:0
}
function fmd(evt){
	mousePos.x = evt.clientX;
	mousePos.y = evt.clientY;
	mouseDown = true;

	$(window).on("mousemove", movingMouse);
	$(window).on("mouseup", fmu);
}

function movingMouse(evt){
	var diff = {
		x: evt.clientX - mousePos.x,
		y: evt.clientY - mousePos.y
	};

	circle.center.x += diff.x;
	circle.center.y += diff.y;

	mousePos.x = evt.clientX;
	mousePos.y = evt.clientY;
}

function fmu(evt){
	mouseDown = false;
	$(window).off("mousemove", movingMouse);
	$(window).off("mouseup", fmu);
	var diff = {
		x: evt.clientX - mousePos.x,
		y: evt.clientY - mousePos.y
	};

	circle.center.x += diff.x;
	circle.center.y += diff.y;
}

function playPause(){
	if(paused){
		btnPlayPause.html("Pause");
		paused = false;
	}else{
		btnPlayPause.html("Play");
		paused = true;
	}
}

function reset(){
	t = 0;
	circle.angle = k * circle.center.x - v * t;
	drawArrow();
	graph.graphStr = "M" + t + "," + (Math.cos(k * (circle.center.x/TO_METER) - v * t) * cosMulti + graph.center.y);
	graph.graph.attr("path", graph.graphStr);
}

function vMoving(x,y){
	v = x*2 + 1;
	$("#vDiv").html("v: " + v);
}

function kMoving(x,y){
	k = x * 2 + 1;
	$("#kDiv").html("k: " + k);
}

var gt = 0;
function update(timestamp){
	//Tempo passado desdo a últim chamada
	var dt = (timestamp - current)/1000;
	current = timestamp;

	if(mouseDown){
		
		drawArrow();
	}
	
	if(!paused){
		t += dt;
		if(mouseDown) {
			circle.graph.attr({cx: circle.center.x, cy: circle.center.y});
			circle.vertical.attr("path", "M" + circle.center.x + "," + (circle.center.y - circle.ray) + "L" + circle.center.x + "," + (circle.center.y + circle.ray));
		}
		circle.angle = k * (circle.center.x/TO_METER) - v * t;
		drawArrow();
		
		/*if(gt >= 2){
			updateGraph();
			gt = 0;
		}else{
			gt++;
		}*/
		updateGraph();
		
	}else{
		if(mouseDown) {
			circle.graph.attr({cx: circle.center.x, cy: circle.center.y});
			circle.angle = k * (circle.center.x/TO_METER) - v * t;
			drawArrow();
		}
	}

	requestAnimationFrame(update);
}

function drawArrow(){
	circle.arrow.attr("path", "M" + circle.center.x + "," + circle.center.y + "L" + (circle.center.x + (circle.ray * Math.cos(circle.angle))) + "," + (circle.center.y + (circle.ray * Math.sin(circle.angle))))
}

function updateGraph(){
	var str = "M";
	for (var i = 0; i < $("#raphael").width(); i+= 3) {
		str += i + "," + (Math.cos(k * i/TO_METER - v * t) * TO_METER + graph.center.y) + "L";

	};
	//graph.graphStr += "L" + t * 50 + "," + (Math.cos(k * (circle.center.x/TO_METER) - v * t) * cosMulti + graph.center.y)
	graph.graph.attr("path", str);
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
