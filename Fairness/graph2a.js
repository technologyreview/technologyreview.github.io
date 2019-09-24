// max-width: 878 px

function drawGraph2a() {

	// create svg
	var chartHeight = 240 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight // height of svg

	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	// define constants specific to this graphic
	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 700 

	var start = 5
	var thresh = bucketWidth*start

	// bucket labels
	drawBuckets(svg, chartHeight + bucketLabelHeight/2, bucketWidth)

	// add dots
	var [d, spacing] = drawDots(svg, unscored_bw_buckets, gray, chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*17

	var threshy1 = chartHeight-maxDotStack
	var threshy2 = chartHeight+10 // +10 to go over dots
	var threshTicksEl = drawThreshTicks(svg, threshy1, threshy2, bucketWidth, graphicWidth)
	var threshEl = drawThresh(svg,thresh,threshy1,threshy2,graphicWidth,1, narrowLayout)

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
