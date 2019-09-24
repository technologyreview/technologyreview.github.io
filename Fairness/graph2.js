// max-width: 878 px

function drawGraph2() {

	// create svg
	var chartHeight = 200 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight // height of svg

	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	// define constants specific to this graphic
	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10

	var start = 5
	var thresh = bucketWidth*start

	// bucket labels
	drawBuckets(svg, chartHeight + bucketLabelHeight/2, bucketWidth)

	// add dots
	var [d, spacing] = drawDots(svg, unscored_bw_buckets, gray, chartHeight, bucketWidth, 1)

}

loadGraphic(drawGraph2)
