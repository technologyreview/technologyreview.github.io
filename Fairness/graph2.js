// max-width: 878 px

function drawGraph2() {

	// create svg
	var chartHeight = 240 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight // height of svg
	var svg = createSVG(svgHeight)

	// bucket labels
	drawBuckets(svg, chartHeight + bucketLabelHeight/2, bucketWidth)

	// add dots
	var [d, spacing] = drawDots(svg, unscored_bw_buckets, orange, chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*17

	// add bespoke key with one circle
	var topOfChart = chartHeight - maxDotStack
	var keyy = topOfChart+8 // starts a quarter of the way between the top of chart and top of slider

	svg.append("circle")
      .attr("cx", keyx+d/2)
      .attr("cy", keyy+6)
      .attr("r", d/2)
      .style("fill", orange)
      .style("stroke", orange)
      .style("stroke-width", strokeWidth)

	drawText(svg,"defendant",keyx+2*d,keyy-.5,{"font-size":11,"font-family":"NeueHaas,sans-serif","fill":dimColor, "font-weight":dimWeight, }) 

}

loadGraphic(drawGraph2)
