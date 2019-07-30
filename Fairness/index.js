
/* INITIALIZE */

// import libraries
// var d3 = require("d3@5")
// var seedrandom = require('https://bundle.run/seedrandom@3.0.1')

/* RESHAPE DATA */

// create reshape functions
function filterRace(races, score) {
  var score_filtered =[]
  
  for (var person of score) {
    if (races.includes(person[2])) {
      score_filtered.push(person)
    }
  }
  
  return score_filtered
}

function bucketScores(array) {
  var dict = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[]}

  for (var i of array) {
    dict[i[0]].push(i[1])
  }
  
  for (var key in dict) {
    dict[key].sort().reverse()
  }
  
  return dict
}


// create data variables
var rng = seedrandom("hey there")
var real_score_bw, fake_score_bw_buckets, real_score_black_buckets, real_score_white_buckets

// import data
d3.csv("./data/compas-scores-two-years.csv").then(function(non_violent) {
	// create data variables
	var score = non_violent.map(a => [Number(a.decile_score), Number(a.two_year_recid), (a.race)])
	var score_bw = filterRace(["Caucasian","African-American"],score)
	real_score_bw = score_bw.filter(x => rng() > 0.9216) // adjust threshold to control sample size, 500ish is good
	
	var fake_score_bw = real_score_bw.map(a => [a[0], a[0]>=7])
	fake_score_bw_buckets = bucketScores(fake_score_bw)
	
	var real_score_black = filterRace(["African-American"],real_score_bw)
	real_score_black_buckets = bucketScores(real_score_black)
	
	var real_score_white = filterRace(["Caucasian"],real_score_bw)
	real_score_white_buckets = bucketScores(real_score_white)

	drawGraph6()

	window.addEventListener("resize",resizeWindow)
});

function resizeWindow() {
	d3.select('svg').remove();
	drawGraph6()
}

/* GRAPHIC FUNCTIONS */

// global variables
var params = ({
  graphic_width: 616, // width of svg
  bar_height: 18, // height of bar
  bar_width: 100, // width of bar
  label_width: 120 // width of bar label
})

var yellow = "FCCD23"
var orange = "FC5623"
var blue = "1F23E0"


// draw functions
function drawBuckets(svg, graphicHeight, bucketWidth, scaleHeight) {
  
  // buckets
  for (var i=1; i<=10; i++) {
    svg.append("text")
        .attr("x", (i-1)*bucketWidth+(bucketWidth/2-6)) // subtract font width
        .attr("y", graphicHeight-(scaleHeight-5)) //subtract font height
        .attr("dy", "0.9em")
        .text(i)
        .attr("font-size",12)
        .attr("font-family","sans-serif")
        .attr("opacity",.7)
  }  
}

function drawDots(svg, dots, dotColor, graphicHeight, bucketWidth, scaleHeight, flip) {
  
  // dots
  var ncols = 5 // number of columns
  var verticalMargin = 10 // margin between numbers and bottom of dot stack
  var bucketMargin = bucketWidth/8 // margin between bucket edge and start of dots
  var spacing = bucketMargin/2.5 // spacing between dots
  var d = (bucketWidth - 2*bucketMargin - (ncols-1)*spacing)/ncols // compute diameter dynamically
  d = Math.max(2,Math.min(10,d))
  
  for (var i=1; i<=10; i++) { // for each bucket
    var dotsInBucket = dots[i] // filter to dots in bucket
    var nrows = Math.ceil(dotsInBucket.length/ncols) // compute number of rows
    
    for (var j in dotsInBucket) { // for each dot
      var row = Math.floor(j/ncols) // calculate row index
      var col = j%ncols // calculate column index
      var bucketStart = (i-1)*bucketWidth // calculate x value for left edge of bucket
      
      // draw circles
      
      var circles = svg.append("circle")
        .attr("cx", bucketStart + bucketMargin + col*(d+spacing)) // convert cx to pixel
        .attr("cy", graphicHeight + (-scaleHeight - (verticalMargin + row*(d+spacing)))*flip) // convert cy to pixel
        .attr("r", d/2) // computer radius
        .style("fill", dotsInBucket[j]?dotColor:"white") // fill or no fill
        .style("stroke", dotColor) // same stroke
        .style("stroke-width", Math.max(0.5,Math.min(1,d/8)))
    }
  }
  
  return [d, spacing]
}

function drawThresh(svg,x,y1,y2,graphicWidth,flip) {
  
  var g = svg.append("g")
  
  g.append("line")
    .attr("x1", x)
    .attr("y1", y1)
    .attr("x2", x)
    .attr("y2", y2)
    .style("stroke", "black")
    .style("opacity", .7)
    .attr("stroke-width", 3) 
    .style("cursor", "pointer")
  
  g.append("rect")
    .attr("x", x)
    .attr("y", y1)
    .attr("width", Math.abs(graphicWidth-x))
    .attr("height", Math.abs(y1 - y2))
    .style("fill", "light gray")
    .style("opacity", .03)
  
  if (flip==1) {
    addLabel(g,"jailed →",x+10,y1,"serif","italic")
  } else {
    addLabel(g,"jailed →",x+10,y2-18,"serif","italic")
  }
  
  return g
}

function moveThresh(g, x, graphicWidth) {
  g.selectAll("line")
    .attr("x1",x)
    .attr("x2",x)

  g.selectAll("rect")
    .attr("x",x)
    .attr("width",graphicWidth-x)

  g.selectAll("text")
    .attr("x", x+10)
}

function drawBar(svg, x, y, label, value) {
  svg.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", "0.9em")
      .text(label)
      .attr("font-size",14)
      .attr("overflow-wrap","normal")
  
  svg.append("rect")
    .attr("width",value*params.bar_width)
    .attr("height",params.bar_height-1)
    .attr("x",x+params.label_width)
    .attr("y",y)
  
  svg.append("rect")
    .attr("width",params.bar_width)
    .attr("height",params.bar_height-1)
    .attr("x",x+params.label_width)
    .attr("y",y)
    .attr("fill","none")
    .attr("stroke","black")
  
  svg.append("text")
      .attr("x", x+params.label_width+params.bar_width+10)
      .attr("y", y)
      .attr("dy", "0.9em")
      .text((value*100).toFixed(0)+"%")
      .attr("font-size",14)
}

function addLabel(svg,label,x,y,family,style) {
  var font_size = 12
  
  svg.append("text")
      .attr("x", x)
      .attr("y", y+font_size)
      .text(label)
      .attr("font-size",font_size)
      .attr("font-family",family)
      .attr("font-style",style)
      .attr("opacity","0.75")
}

function addKey(svg,graphicWidth) {
  addLabel(svg,"not re-arrested",graphicWidth-80,0,"sans-serif")
  addLabel(svg,"re-arrested",graphicWidth-80,20,"sans-serif")
  svg.append("circle")
      .attr("cx", graphicWidth-95)
      .attr("cy", 8.5)
      .attr("r", 5)
      .style("fill", "white")
      .style("stroke", "gray")
  svg.append("circle")
      .attr("cx", graphicWidth-95)
      .attr("cy", 28.5)
      .attr("r", 5)
      .style("fill", "gray")
      .style("stroke", "gray")
}


// statistics calculations
function acc(d, thresh) {
  var tp = 0
  var tn = 0
  var total = d.length
  
  for (var i of d) {
    var arrested = i[1]
    if ((i[0] > thresh) && arrested) {
      tp += 1
    }
    if ((i[0] <= thresh) && (!arrested)) {
      tn += 1
    }
    
  }
  return (tp+tn)/total
}

function fpr(d, thresh) {
  var fp = 0
  var n = 0
  
  for (var i of d) {
    var arrested = i[1]
    if ((i[0] > thresh) && (!arrested)) {
      fp += 1
    }
    if (!arrested) {
      n += 1
    }
  }
  
  return fp/n
}

function fnr(d, thresh) {
  var fn = 0
  var p = 0
  
  for (var i of d) {
    var arrested = i[1]
    if ((i[0] <= thresh) && (arrested)) {
      fn += 1
    }
    if (arrested) {
      p += 1
    }
  }
  
  return fn/p
}



/* DRAW GRAPHICS */
function drawGraph6() {
	var graphicHeight = 150
	var canvasHeight = graphicHeight*2
	var keyHeight = 40
	var svgHeight = canvasHeight + keyHeight

	// create svg
	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10
	var scaleHeight = 20

	var whiteThresh = bucketWidth*5
	var blackThresh = bucketWidth*4

	// bucket labels
	drawBuckets(svg, graphicHeight+keyHeight, bucketWidth, scaleHeight)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, yellow, graphicHeight+keyHeight, bucketWidth, scaleHeight, 1)
	var maxDotStack = (d+spacing)*13

	var wy1 = graphicHeight+keyHeight-scaleHeight-maxDotStack
	var wy2 = graphicHeight+keyHeight-scaleHeight
	var whiteThreshEl =
	  drawThresh(svg,whiteThresh,wy1,wy2,graphicWidth,1)
	var wlabely2 = graphicHeight+keyHeight-scaleHeight-(maxDotStack+20)

	addLabel(svg,"white defendants",0,wlabely2,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, graphicHeight+keyHeight-scaleHeight, bucketWidth, scaleHeight, -1)
	var by1 = graphicHeight+keyHeight
	var by2 = graphicHeight+keyHeight+maxDotStack
	var blackThreshEl = 
	  drawThresh(svg,blackThresh,by1,by2,graphicWidth,-1)
	var blabely2 = graphicHeight+keyHeight+maxDotStack
	addLabel(svg,"black defendants",0,blabely2,"serif","italic")

	// key
	addKey(svg,graphicWidth)

	var sliderList = [ 
	{
	  dragging: false,
	  el: whiteThreshEl,
	  pos: whiteThresh,
	  y1: wy1,
	  y2: wy2
	},
	{
	  dragging: false,
	  el: blackThreshEl,
	  pos: blackThresh,
	  y1: by1,
	  y2: by2,
	}
	]
	  
	addSliders(svg, sliderList, bucketWidth, graphicWidth)
}

function addSliders(svg, sliderList, bucketWidth, graphicWidth) {
	function startDrag() {
	    const [x, y] = d3.mouse(this)
	    for (var slider of sliderList) {
	      if ((y>slider.y1) && (y<slider.y2) && (Math.abs(x-slider.pos)<20)) {
	        slider.dragging = true
	        d3.event.preventDefault()
	      }
	    }
	}
	svg.on('mousedown', startDrag)
	svg.on('touchstart', startDrag)


	function moveDrag() {
	   	for (var slider of sliderList) {
	      if (slider.dragging) {
	        const [x, y] = d3.mouse(this)
	        moveThresh(slider.el, x, graphicWidth)
	      }
	    }
	}
	svg.on('mousemove', moveDrag)
	svg.on('touchmove', moveDrag)
  

	function stopDrag() {
	    for (var slider of sliderList) {
	      if (slider.dragging) {
	        slider.dragging = false
	        var [x, y] = d3.mouse(this)
	        x = Math.floor(x/bucketWidth + 0.5)*bucketWidth
	        moveThresh(slider.el, x, graphicWidth)
	        slider.pos = x
	      }
	    }
	}

	svg.on('mouseup', stopDrag)
	svg.on('mouseleave', stopDrag)
	svg.on('touchend', stopDrag)
	svg.on('touchcancel', stopDrag)

}
