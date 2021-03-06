// max-width: 878 px

function drawGraph2a() {

	// create svg
	var chartHeight = 240 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight // height of svg
	var svg = createSVG(svgHeight)

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 700 

	// default threshold
	var thresh = bucketWidth*start

	// bucket labels
	drawBuckets(svg, keyHeight/2+graphicHeight, bucketWidth)

	// add dots
	var [d, spacing] = drawDots(svg, unscored_bw_buckets, orange, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*17

	var threshy1 = keyHeight+chartHeight-maxDotStack
	var threshy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var threshTicksEl = drawThreshTicks(svg, threshy1, threshy2, bucketWidth, graphicWidth)
	var threshEl = drawThresh(svg,"",thresh,threshy1,threshy2,graphicWidth,1, narrowLayout)

	// COMPAS threshold
	var threshCOMPAS = drawCompasThresh(svg,threshy1,threshy2)

	// add key, position dynamic to size of chart
	var keyy = threshy1/2-keyHeight/3
	
	// bespoke key with one circle
	svg.append("circle")
      .attr("cx", keyx+d/2)
      .attr("cy", keyy+6)
      .attr("r", d/2)
      .style("fill", orange)
      .style("stroke", orange)
      .style("stroke-width", strokeWidth)
    drawText(svg,"defendant",keyx+2*d,keyy-.5,{"font-size":11,"font-family":"NeueHaas,sans-serif","fill":dimColor, "font-weight":dimWeight, }) 
	
	// sliders
	var sliderList = [ 
		{
		  dragging: false,
		  el: threshEl,
		  ticksEl: threshTicksEl,
		  pos: thresh,
		  y1: threshy1,
		  y2: threshy2
		}
	]

	// called whenever the threshold moves
	function threshChanged(newThresh) {
	}

	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)

}

loadGraphic(drawGraph2a)
