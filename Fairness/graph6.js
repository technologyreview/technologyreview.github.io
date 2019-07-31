function drawGraph6() {
	var chartHeight = 160 // height of chart area above and below
	var bucketLabelHeight = 40 // height of bucket labels
	var graphicHeight = chartHeight*2 + bucketLabelHeight // height of full canvas
	var keyHeight = 40 // height of key
	var barChartHeight = 155 // height of bar chart
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
	var whiteThreshTicksEl = drawThreshTicks(svg, wy1, wy2, bucketWidth)
	var whiteThreshEl = drawThresh(svg,whiteThresh,wy1,wy2,graphicWidth,1)
	addLabel(svg,"white defendants",0,wy1-18,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, keyHeight+chartHeight+bucketLabelHeight, bucketWidth, -1)
	var by1 = keyHeight+chartHeight+bucketLabelHeight-10 // -10 to go over dots
	var by2 = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	var blackThreshTicksEl = drawThreshTicks(svg, by1, by2, bucketWidth)
	var blackThreshEl = drawThresh(svg,blackThresh,by1,by2,graphicWidth,-1)
	addLabel(svg,"black defendants",0,by2,"serif","italic")

	// add key, position dynamic to size of chart
	var keyx = graphicWidth - 100
	var keyy = wy1/6 // starts a quarter of the way between the top of chart and top of slider
	addKey(svg,keyx,keyy,d)

	var sliderList = [ 
		{
		  dragging: false,
		  el: whiteThreshEl,
		  ticksEl: whiteThreshTicksEl,
		  pos: whiteThresh,
		  y1: wy1,
		  y2: wy2
		},
		{
		  dragging: false,
		  el: blackThreshEl,
		  ticksEl: blackThreshTicksEl,
		  pos: blackThresh,
		  y1: by1,
		  y2: by2,
		}
	]

	// bar charts, size & position dynamic to size of svg
	var barYStart = by2 + (svgHeight - by2)/4 // bar position starts 1/3 of the way
	barYStart = Math.max(by2+15,barYStart) // min 20 pixels away from bottom of chart
	
	var barWidth = graphicWidth/3
	barWidth = Math.max(100,Math.min(300,barWidth)) // min & max barWidth
	
	var barXstart = graphicWidth/3
	var barSpacing = 8 // spacing between bars in same group
	var barGroupSpacing = 30 // spacing between grouped bars

	var barData = [
		{
			label: "white",
			y: barYStart,
			color: yellow,
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "white",
			y: barYStart+2*params.barHeight+barSpacing+barGroupSpacing,
			color: yellow,
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},		
		{
			label: "black",
			y: barYStart+params.barHeight+barSpacing,
			color: blue,
			getVal: function() { return fpr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
		{
			label: "black",
			y: barYStart+3*params.barHeight+2*barSpacing+barGroupSpacing,
			color: blue,
			getVal: function() { return fnr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
	]

	for (var b of barData) {
		b.el = drawBar(svg,barXstart,b,barWidth)
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
