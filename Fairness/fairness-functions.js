



/* DRAW GRAPHIC ELEMENTS */

// global variables
var params = ({
  barHeight: 18, // height of bar
  barWidth: 100, // width of bar
  labelWidth: 35 // width of bar label
})

var yellow = "#FCCD23"
var orange = "#FC5623"
var blue = "#1F23E0"


// draw functions
function drawBuckets(svg, y, bucketWidth) {
  
  // buckets
  for (var i=1; i<=10; i++) {
    svg.append("text")
        .attr("x", (i-1)*bucketWidth+(bucketWidth/2-6)) // subtract font width
        .attr("y", y-5) //subtract font height
        .attr("dy", "0.9em")
        .text(i)
        .attr("font-size",12)
        .attr("font-family","sans-serif")
        .attr("opacity",.7)
  }  
}

function drawDots(svg, dots, dotColor, ystart, bucketWidth, flip) {
  
  // dots
  var ncols = 5 // number of columns
  // var verticalMargin = 10 // margin between numbers and bottom of dot stack
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
        .attr("cy", ystart + (-row*(d+spacing))*flip) // convert cy to pixel
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
    addLabel(g,"will likely be jailed →",x+10,y1,"serif","italic")
  } else {
    addLabel(g,"will likely be jailed →",x+10,y2-18,"serif","italic")
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

function drawBar(svg, x, d, barWidth) {
  var g = svg.append("g")
  var family = "sans-serif"
  var fontsize = 12
  var opacity = 0.8

  g.append("text")
    .attr("x", x-params.labelWidth)
    .attr("y", d.y)
    .attr("dy", "0.9em")
    .text(d.label)
    .attr("font-size",fontsize)
    .attr("font-family",family)
    .attr("opacity",opacity)
    .attr("overflow-wrap","normal")
  
  g.append("rect")
    .attr("width",barWidth)
    .attr("height",params.barHeight-1)
    .attr("x",x)
    .attr("y",d.y)
    .style("fill", "light gray")
    .style("opacity", .08)

  g.append("rect")
    .attr("width",d.getVal()*barWidth)
    .attr("height",params.barHeight-1)
    .attr("x",x)
    .attr("y",d.y)
    .attr("fill",d.color)
    .attr("id", "barVal")
  
  g.append("text")
    .attr("x", x+barWidth+10)
    .attr("y", d.y)
    .attr("dy", "0.9em")
    .text((d.getVal()*100).toFixed(0)+"%")
    .attr("font-size",fontsize)
    .attr("font-family",family)
    .attr("opacity",opacity)
    .attr("id", "textVal")

  return g
}

// Updates bar value. Element and data values stored in d
function updateBar(d) {
  d.el.select("#barVal").attr("width",d.getVal()*params.barWidth)
  d.el.select("#textVal").text((d.getVal()*100).toFixed(0)+"%")
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

function addKey(svg,x,y,d) {
  addLabel(svg,"not re-arrested",x,y,"sans-serif")
  addLabel(svg,"re-arrested",x,y+16,"sans-serif")

  // blue filled circle
  svg.append("circle")
      .attr("cx", x-2*d)
      .attr("cy", y+8)
      .attr("r", d/2)
      .style("fill", "white")
      .style("stroke", blue)

  // yellow filled circle
  svg.append("circle")
      .attr("cx", x-4*d)
      .attr("cy", y+8)
      .attr("r", d/2)
      .style("fill", "white")
      .style("stroke", yellow)

  // blue unfilled circle
  svg.append("circle")
      .attr("cx", x-2*d)
      .attr("cy", y+8+16)
      .attr("r", d/2)
      .style("fill", blue)
      .style("stroke", blue)

  // yellow unfilled circle
  svg.append("circle")
      .attr("cx", x-4*d)
      .attr("cy", y+8+16)
      .attr("r", d/2)
      .style("fill", yellow)
      .style("stroke", yellow)
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


function pixelsToScore(pixels, bucketWidth) {
  return Math.floor(pixels/bucketWidth + 0.5)
}
function scoreToPixels(score, bucketWidth) {
  return score*bucketWidth
}


function addSliders(svg, sliderList, bucketWidth, graphicWidth,callback) {
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
          slider.pos = x
          callback(x)
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
	        x = scoreToPixels(pixelsToScore(x,bucketWidth),bucketWidth)
	        moveThresh(slider.el, x, graphicWidth)
          slider.pos = x
          callback(x)
	        
	      }
	    }
	}

	svg.on('mouseup', stopDrag)
	svg.on('mouseleave', stopDrag)
	svg.on('touchend', stopDrag)
	svg.on('touchcancel', stopDrag)

}

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
    dict[key].sort().reverse() // draw filled dots (arrested = 1) first
  }
  
  return dict
}

// --- MAIN ---

// create data variables
var rng = seedrandom("hey there")
var real_score_bw, fake_score_bw_buckets, real_score_black_buckets, real_score_white_buckets
var real_score_white, real_score_black

// Loads the the COMPAS data, subsamples it, calls drawFunction to render the graphic
function loadGraphic(drawGraphFunction) {

  // called when the window is resized
  function resizeWindow() {
    d3.select('svg').remove();
    drawGraphFunction()
  }

  // import data
  d3.csv("./data/compas-scores-two-years.csv").then(function(non_violent) {
    // create data variables
    var score = non_violent.map(a => [Number(a.decile_score), Number(a.two_year_recid), (a.race)])
    var score_bw = filterRace(["Caucasian","African-American"],score)
    real_score_bw = score_bw.filter(x => rng() > 0.9216) // adjust threshold to control sample size, 500ish is good

    var fake_score_bw = real_score_bw.map(a => [a[0], a[0]>=7])
    fake_score_bw_buckets = bucketScores(fake_score_bw)
    
    real_score_black = filterRace(["African-American"],real_score_bw)
    real_score_black_buckets = bucketScores(real_score_black)
    
    real_score_white = filterRace(["Caucasian"],real_score_bw)
    real_score_white_buckets = bucketScores(real_score_white)

    drawGraphFunction()

    window.addEventListener("resize",resizeWindow)
  });

}
