
/* DRAW GRAPHIC ELEMENTS */

// parameters that define drawing layout and style
var params = {
  barHeight: 20,          // height of bar
  threshWidthScale: 400,  // at this screen width the threshold will be 1px wide
  handleWidth: 7,         // threshold drag handle width
  handleHeight: 20,       // threshold drag handle width
  sliderHitWidth: 30,     // how far away from threshold you can click
}

var yellow = "#FCCD23"
var orange = "#FC5623"
var blue = "#373bd6"
var gray = "#979797"
var dimColor = "#4D4D4D"
var dimWeight = 200

// define constants for spacing of graphics
// define constants for vertical spacing
var graphicWidth, narrowLayout, bucketWidth, keyx
var keyHeight = 30 // height of key
var bucketLabelHeight = 40 // height of bucket labels
var strokeWidth
var barChartTopPadding = 20
var barWidth = 350
var start = 5

// define constants for text spacing
var label_font_size = 12
var numMargin = 20  // margin from end of bar to numbers
var numSpacing = 20 // spacing between numbers to right of bars

// create svg
function createSVG(svgHeight) {
  var svg = d3.select("body").append("svg")
    .attr("width","100%")
    .attr("height",svgHeight)

  // calculate graphic width
  graphicWidth = svg.node().getBoundingClientRect().width

  // set threshold for switching to narrow layout
  narrowLayout = graphicWidth < (barWidth + 100)

  // calculate bucket width
  bucketWidth = graphicWidth/10

  // calculate key
  if (narrowLayout) {
    keyx = scoreToPixels(7,bucketWidth)+bucketWidth/8
  } else {
    keyx = scoreToPixels(8,bucketWidth)+bucketWidth/8
  }
  

  return svg
}


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
        .style("fill",dimColor)
        .style("font-weight",dimWeight)
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
  strokeWidth = Math.max(0.5,Math.min(1,d/8))
  
  for (var i=1; i<=10; i++) { // for each bucket
    var dotsInBucket = dots[i] // filter to dots in bucket
    var nrows = Math.ceil(dotsInBucket.length/ncols) // compute number of rows
    var bucketStart = (i-1)*bucketWidth // calculate x value for left edge of bucket

    for (var j in dotsInBucket) { // for each dot
      var row = Math.floor(j/ncols) // calculate row index
      var col = j%ncols // calculate column index
      
      // draw circles
      var circles = svg.append("circle")
        .attr("cx", bucketStart + bucketMargin + col*(d+spacing) + d/2) // convert col to pixel
        .attr("cy", ystart + (-row*(d+spacing))*flip) // convert row to pixel
        .attr("r", d/2) // compute radius
        .style("fill", dotsInBucket[j]?dotColor:"white") // fill or no fill
        .style("stroke", dotColor) // same stroke
        .style("stroke-width", Math.max(0.5,Math.min(1,d/8)))
    }
  }
  
  return [d, spacing]
}

function calcThreshWidth(graphicWidth) {
  return Math.min(3,Math.max(1, graphicWidth/params.threshWidthScale)) // get narrower lines on small screens
}

function calcHandleWidth(graphicWidth) {
  return Math.min(params.handleWidth, params.handleWidth*(graphicWidth/params.threshWidthScale)/2)
}

function drawCompasThresh(svg,y1,y2) {
  var x = bucketWidth*7
  var g = svg.append("g")

  // main thresh line
  g.append("line")
    .attr("x1", x)
    .attr("y1", y1-16)
    .attr("x2", x)
    .attr("y2", y2)
    .style("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray","2,4")

  // label as COMPAS
  drawText(
    g, 
    "COMPAS",
    x, 
    y1-28, 
    {"font-size":10,
     "text-anchor":"middle",
     "fill":dimColor,
     "font-weight":dimWeight, })

}

function drawThresh(svg,label,x,y1,y2,graphicWidth,flip,narrowLayout) {
  var threshWidth = calcThreshWidth(graphicWidth)
  var handleWidth = calcHandleWidth(graphicWidth)
  var font_size = 12

  var g = svg.append("g")

  // background fill to right of thresh
  g.append("rect")
    .attr("id", "fillrect")
    .attr("x", x)
    .attr("y", y1)
    .attr("width", Math.abs(graphicWidth-x))
    .attr("height", Math.abs(y1 - y2))
    .style("fill", "gray")
    .style("opacity", .03)  
  slider = g.append("g")
    .attr("id", "slider")
    .attr("data-label", label)
    .attr("transform", "translate("+x+",0)")

  // main thresh line
  slider.append("line")
    .attr("x1", 0)
    .attr("y1", y1)
    .attr("x2", 0)
    .attr("y2", y2)
    .style("stroke", "gray")
    .attr("stroke-width", threshWidth) 

  // drag handle
  var y = (y1+y2)/2
  slider.append("rect")
    .attr("x", -handleWidth/2)
    .attr("y", y-params.handleHeight/2)
    .attr("width", handleWidth)
    .attr("height", params.handleHeight)
    .style("fill", "gray")

  if (!narrowLayout) {
    // delightful arrows
    var ad = 8 // arrow distance
    var aw = 8 // arrow width
    var ah = 8 // arrow height
    slider.append("path")
      .attr("id", "rightArrow")
      .attr("d", 
            " M " + ad + " " + (y-ah/2) + 
            " L " + (ad+aw) + " " + y +
            " L " + ad + " " + (y+ah/2))
      .style("fill", "gray")
      .attr("transform", "translate(0,0)")
    slider.append("path")
      .attr("id", "leftArrow")
      .attr("d", 
            " M " + -ad + " " + (y-ah/2) + 
            " L " + -(ad+aw) + " " + y +
            " L " + -ad + " " + (y+ah/2))
      .style("fill", "gray")
      .attr("transform", "translate(0,0)")
  }

  // invisible handle to change the cursor
  slider.append("rect")
    .attr("id","hitHandle")
    .attr("x", -params.sliderHitWidth)
    .attr("y", y1)
    .attr("width", 2*params.sliderHitWidth)
    .attr("height", y2-y1)
    .style("fill", "green")
    .style("opacity", 0)
    .style("cursor", "col-resize")

  if (flip==1) {
    drawText(slider,"jailed →",10,y1+font_size,12,{"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight,"font-size":font_size+"px"}) 
    drawText(slider,"← released",-10,y1+font_size,12,{"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight,"font-size":font_size+"px","text-anchor":"end"}) 

  } else {
    drawText(slider,"jailed →",10,y2-18+font_size,12,{"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight,"font-size":"12px"}) 
    drawText(slider,"← released",-10,y2-18+font_size,12,{"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight,"font-size":"12px","text-anchor":"end"}) 
  }
  
  return g
}


function moveThresh(g, x, graphicWidth) {
  g.select("#slider")
    .attr("transform", "translate("+x+",0)")

  g.select("#fillrect")
    .attr("x",x)
    .attr("width",graphicWidth-x)

}

// the grey "ticks" that show where the user can drag the threshold to
function drawThreshTicks(svg, y1, y2, bucketWidth, graphicWidth) {
  var threshWidth = calcThreshWidth(graphicWidth)
  var handleWidth = calcHandleWidth(graphicWidth)

  var g = svg.append("g").style("opacity", 0) // off at first

  for (var i=0; i<=10; i++) {
    var x = scoreToPixels(i, bucketWidth)
    g.append("rect")
      .attr("x", x-params.handleWidth/2)
      .attr("y", (y1+y2)/2-params.handleHeight/2)
      .attr("width", handleWidth)
      .attr("height", params.handleHeight)
      .style("fill", "#f0f0f0")
    g.append("line")
      .attr("x1", x)
      .attr("y1", (y1+y2)/2 - params.handleHeight/2 - 10)
      .attr("x2", x)
      .attr("y2", (y1+y2)/2 + params.handleHeight/2 + 10)
      .style("stroke", "#f0f0f0")
      .attr("stroke-width", threshWidth) 
  }

  return g
}

function drawBar(svg, x, d, barWidth, narrowLayout, numMargin, numSpacing) {
  var g = svg.append("g")
  g.attr("class", d.class)

  var font_size = "12px"
  var number_font_size = "14px"
  var numbersY = d.y+2
  var [percent,numer,denom] = d.getVal()

  if (narrowLayout) {
    barWidth = graphicWidth - 100
    x = (graphicWidth-barWidth)/2
    font_size = "10px"

    if (d.calc=="fpr") {

      drawText(g,
               numer + " rated \"high risk\" / " + denom + " not re-arrested",
               x+barWidth/2,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"fpr", "font-family":"sans-serif", "text-anchor":"middle"})
    
    } else if (d.calc == "fnr") {
      drawText(g,
               numer + " rated \"low risk\" / " + denom + " re-arrested",
               x+barWidth/2,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"fnr", "font-family":"sans-serif", "text-anchor":"middle"})

    } else if (d.calc == "acc") {
      drawText(g,
               numer + " predicted correctly / " + denom + " defendants",
               x+barWidth/2,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"acc", "font-family":"sans-serif", "text-anchor":"middle"})
    }
  } else {
      if (d.calc=="fpr") {

      drawText(g,
               "Out of the " + denom + " defendants not re-arrested, " + numer + " are rated \"high risk.\"",
               x,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"fpr", "font-family":"sans-serif"})
      
    } else if (d.calc == "fnr") {
      drawText(g,
               "Out of the " + denom + " defendants re-arrested, " + numer + " are rated \"low risk.\"",
               x,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"fnr", "font-family":"sans-serif"})

    } else if (d.calc == "acc") {
      drawText(g,
               "Out of the " + denom + " total defendants, " + numer + " were predicted correctly.",
               x,
               numbersY+params.barHeight+2,
               { "font-size":font_size, "fill":dimColor, "font-weight":dimWeight, "id":"acc", "font-family":"sans-serif"})
    }
  }

  

  drawText(g, d.label,x-10,numbersY, 
    {"font-size":font_size,
     "text-anchor":"end"})

  g.append("rect")
    .attr("width",barWidth)
    .attr("height",params.barHeight-1)
    .attr("x",x)
    .attr("y",d.y)
    .style("fill", "light gray")
    .style("opacity", .06)

  g.append("rect")
    .attr("width",percent*barWidth)
    .attr("height",params.barHeight-1)
    .attr("x",x)
    .attr("y",d.y)
    .attr("fill",d.color)
    .attr("id", "barVal")


  var numbersX = x+barWidth+10
  
  drawText(g,
           (percent*100).toFixed(0)+"%",
           numbersX,
           numbersY,
           { "font-size":number_font_size,"font-weight":"bold", "id":"percent"})


  

  return g
}

// Updates bar value. Element and data values stored in d
function updateBar(d,barWidth) {
  var [percent,numer,denom] = d.getVal()

  if (narrowLayout) {
    barWidth = graphicWidth - 100

    d.el.select("#fpr").text(numer + " rated \"high risk\" / " + denom + " not re-arrested")
    d.el.select("#fnr").text(numer + " rated \"low risk\" / " + denom + " re-arrested")
    d.el.select("#acc").text(numer + " predicted correctly / " + denom + " defendants")

  } else {
    d.el.select("#fpr").text("Out of the " + denom + " defendants not re-arrested, " + numer + " are rated \"high risk.\"")
    d.el.select("#fnr").text("Out of the " + denom + " defendants re-arrested, " + numer + " are rated \"low risk.\"")
    d.el.select("#acc").text("Out of the 500 total defendants, " + numer + " were predicted correctly.")
  
  }

  d.el.select("#barVal").attr("width",percent*barWidth)
  d.el.select("#percent").text((percent*100).toFixed(0)+"%")

}

function drawNumLabel(svg,label,x,y) {
  var font_size = 10
  var family = "sans-serif"
  var weight = "light"
  var transform = "uppercase"

  svg.append("text")
      .attr("x", x)
      .attr("y", y+font_size/2)
      .text(label)
      .attr("font-size",font_size + "px")
      .attr("font-family",family)
      .attr("font-weight",weight)
      .attr("text-transform",transform)
      .attr("opacity","0.75")
}

function drawText(svg, text, x, y, attrs,styles="") {
  t = svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .text(text)

  // default font if none given in attrs
  if (!attrs["font-family"]) 
    attrs["font-family"] = "sans-serif"

  // make Y coordinate specify top edge of the text
  attrs["dominant-baseline"] = "text-before-edge"

  for (var a in attrs) {
    t.attr(a, attrs[a])
  }

  for (var s in styles) {
    t.style(s, styles[s])
  }

  return t
}

function addLabel(
  svg,
  label,
  x,
  y,
  font_size=12,
  font_family="sans-serif",
  font_style,
  id,
  opacity=0.75,
  font_weight,
  text_anchor="start") 
{
  var t = svg.append("text")
      .attr("x", x)
      .attr("y", y+font_size)
      .text(label)
      .attr("font-size", font_size + "px")
      .attr("font-family",font_family)
      .attr("font-style",font_style)
      .attr("font-weight",font_weight)
      .attr("text-anchor", text_anchor)
      .attr("opacity",opacity)
      .attr("id",id)

  return t
}

function addKeyCircles(svg,cx,cy,r,spacing,colors,strokeWidth) {
  cx = cx - r - spacing

  for (color of colors) {
    cx += 2*r+spacing

    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .style("fill", "white")
      .style("stroke", color)
      .style("stroke-width", strokeWidth)

    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy+16)
      .attr("r", r)
      .style("fill", color)
      .style("stroke", color)
      .style("stroke-width", strokeWidth)
  }
}

function addKey(svg,x,y,r,spacing,colors,strokeWidth) {
  drawText(svg,"not re-arrested",x+colors.length*(2*r+spacing)+r,y+r/2,{"font-size":11,"font-family":"sans-serif","fill":dimColor, "font-weight":dimWeight, }) 
  drawText(svg,"re-arrested",x+colors.length*(2*r+spacing)+r,y+r/2+16,{"font-size":11,"font-family":"sans-serif","fill":dimColor, "font-weight":dimWeight, }) 

  addKeyCircles(svg,x,y+8,r,spacing,colors,strokeWidth)

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
  return [(tp+tn)/total,tp+tn,total]
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
  
  return [fp/n,fp,n]
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
  
  return [fn/p,fn,p]
}


function pixelsToScore(pixels, bucketWidth) {
  return Math.floor(pixels/bucketWidth + 0.5)
}
function scoreToPixels(score, bucketWidth) {
  return score*bucketWidth
}

function reverseBlackWhite(s) {
  return s=="black" ?  "white" : "black"
}

function addSliders(svg, sliderList, bucketWidth, graphicWidth,callback) {

  // Make the sliders animate in and out when the user points at the hit region
  // Also potentially dim some of the bars, if data-dimclass attr is set
  function arrowsOut() {
    var slider = d3.select(this.parentNode) 
    slider.select("#leftArrow").transition().duration(200).attr("transform","translate(-5,0)")
    slider.select("#rightArrow").transition().duration(200).attr("transform","translate(5,0)")

  }
  function arrowsIn() {
    var slider = d3.select(this.parentNode) 
    slider.select("#leftArrow").transition().duration(200).attr("transform","translate(0,0)")
    slider.select("#rightArrow").transition().duration(200).attr("transform","translate(0,0)")

  }

  svg.selectAll("#hitHandle").on('mouseenter', arrowsOut)
  svg.selectAll("#hitHandle").on('mouseleave', arrowsIn)

	function startDrag() {
	    const [x, y] = d3.mouse(this)
	    for (var slider of sliderList) {
	      if ((y>slider.y1) && (y<slider.y2) && (Math.abs(x-slider.pos)<params.sliderHitWidth)) {
	        slider.dragging = true
          slider.ticksEl.style("opacity", 1)
	        d3.event.preventDefault()

          //also keep target dimmed
          var label = slider.label
          var dimTarget = reverseBlackWhite(label)
          svg.selectAll("." + dimTarget).style("opacity",0.3)
          svg.selectAll("." + dimTarget + "Gone").style("opacity",0)
	      }
	    }
	}
	svg.on('mousedown', startDrag)
	svg.on('touchstart', startDrag)


	function moveDrag() {
	   	for (var slider of sliderList) {
        
	      if (slider.dragging) {
	        var [x, y] = d3.mouse(this)
          x = Math.max(0, Math.min(x, 10*bucketWidth))
	        moveThresh(slider.el, x, graphicWidth)
          slider.pos = x
          callback(x)

          //also keep target dimmed
          var label = slider.label
          var dimTarget = reverseBlackWhite(label)
          svg.selectAll("." + dimTarget).style("opacity",0.3)
          svg.selectAll("." + dimTarget + "Gone").style("opacity",0)
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
          x = Math.max(0, Math.min(x, 10*bucketWidth))
	        x = scoreToPixels(pixelsToScore(x,bucketWidth),bucketWidth)
	        moveThresh(slider.el, x, graphicWidth)
          slider.pos = x
          slider.ticksEl.style("opacity", 0)
          callback(x)

          //undim target
          var label = slider.label
          var dimTarget = reverseBlackWhite(label)
          svg.selectAll("." + dimTarget).style("opacity",1)
          svg.selectAll("." + dimTarget + "Gone").style("opacity",1)
	        
	      }
	    }
	}

	svg.on('mouseup', stopDrag)
	svg.on('mouseleave', stopDrag)
	svg.on('touchend', stopDrag)
	svg.on('touchcancel', stopDrag)

}

// draw check
function drawGoal(svg,thresh,y,bucketWidth,goalClass,flip) {
  var x = scoreToPixels(thresh, bucketWidth)
  var g = svg.append("g")
  var rectWidth = 80
  var rectHeight = 24
  var recty = y-flip*10
  var triWidth = 14 // triangle base
  var triHeight = 10 // triangle height

  // tooltip box
  // rectangle body
  var rect = g.append("rect")
    .attr("x", x-rectWidth/2)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .style("fill", "black")
    .style("opacity", 0)
    .style("stroke-width", 0)
    .attr("class",goalClass)

  // triangle
  g.append("path")
    .attr("d", 
          " M " + (x-triWidth/2) + " " + recty + 
          " L " + (x+triWidth/2) + " " + recty +
          " L " + x + " " + (recty+flip*triHeight))
    .style("fill", "black")
    .style("opacity", 0)
    .style("stroke-width", 0)
    .attr("class",goalClass)

  if (flip==1) {
    var textOffset = -28
    rect.attr("y", recty-rectHeight)

  } else {
    var textOffset = 16
    rect.attr("y", recty)
  }

  // text
  var tooltip = addLabel(g,"best threshold",x,y+textOffset,10)
  tooltip.attr("text-anchor","middle")
    .style("fill","white")
    .style("opacity", 0)
    .attr("class",goalClass)

  
  return t
  
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
var real_score_bw, real_score_bw_buckets, fake_score_bw, fake_score_bw_buckets, real_score_black_buckets, real_score_white_buckets
var real_score_white, real_score_black

// Loads the the COMPAS data, subsamples it, calls drawFunction to render the graphic
function loadGraphic(drawGraphFunction) {

  // called when the window is resized
  function resizeWindow() {
    d3.select('svg').remove();
    drawGraphFunction()
  }

  // import data
  d3.csv("./data/real_score_bw.csv").then(function(score) {

    real_score_bw = score.map (a => [Number(a.decile_score), Number(a.two_year_recid), (a.race)])
    real_score_bw_buckets = bucketScores(real_score_bw)

    fake_score_bw = real_score_bw.map(a => [a[0], a[0]>=7])
    fake_score_bw_buckets = bucketScores(fake_score_bw)

    unscored_bw = real_score_bw.map(a => [a[0], 1])
    unscored_bw_buckets = bucketScores(unscored_bw)
    
    real_score_black = filterRace(["African-American"],real_score_bw)
    real_score_black_buckets = bucketScores(real_score_black)
    
    real_score_white = filterRace(["Caucasian"],real_score_bw)
    real_score_white_buckets = bucketScores(real_score_white)

    drawGraphFunction()

    window.addEventListener("resize",resizeWindow)
  });

}
