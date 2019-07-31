function drawGraph6() {
	var chartHeight = 150 // height of chart area above and below
	var bucketLabelHeight = 40 // height of bucket labels
	var graphicHeight = chartHeight*2 + bucketLabelHeight // height of full canvas
	var keyHeight = 40 // height of key
	var barChartHeight = 80 // height of bar chart
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg

	// create svg
	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10

	var blackStart = 4
	var whiteStart = 5
	var whiteThresh = bucketWidth*whiteStart
	var blackThresh = bucketWidth*blackStart

	// bucket labels
	drawBuckets(svg, keyHeight+graphicHeight/2, bucketWidth)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, yellow, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*11

	var wy1 = keyHeight+chartHeight-maxDotStack
	var wy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var whiteThreshEl = drawThresh(svg,whiteThresh,wy1,wy2,graphicWidth,1)
	addLabel(svg,"white defendants",0,wy1-18,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, keyHeight+chartHeight+bucketLabelHeight, bucketWidth, -1)
	var by1 = keyHeight+chartHeight+bucketLabelHeight-10 // -10 to go over dots
	var by2 = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	var blackThreshEl = drawThresh(svg,blackThresh,by1,by2,graphicWidth,-1)
	addLabel(svg,"black defendants",0,by2,"serif","italic")

	addKey(svg,keyHeight,graphicWidth)

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

	// bar charts
	var bottomOfGraph = keyHeight + graphicHeight
	var barYStart = bottomOfGraph + (svgHeight - bottomOfGraph)/3

	var barData = [
		{
			label: "FPR, white defendants",
			x: 0,
			y: barYStart,
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "FNR, white defendants",
			x: 300,
			y: barYStart,
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},		
		{
			label: "FPR, black defendants",
			x: 0,
			y: barYStart+30,
			getVal: function() { return fpr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
		{
			label: "FNR, black defendants",
			x: 300,
			y: barYStart+30,
			getVal: function() { return fnr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
	]

	for (var b of barData) {
  	b.el = drawBar(svg,b)		
	}
		// called whenever the threshold moves
	function threshChanged(newThresh) {
		for (var b of barData) {
  		updateBar(b)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)


}

loadGraphic(drawGraph6)
