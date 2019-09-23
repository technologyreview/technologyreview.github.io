function drawGraph5() {

	// create svg
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg

	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	// define constants specific to this graphic
	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10
	var whiteStart = 5
	var whiteThresh = bucketWidth*whiteStart

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 550 

	// bucket labels
	drawBuckets(svg, keyHeight/2+graphicHeight, bucketWidth)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, orange, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*11

	var wy1 = keyHeight+chartHeight-maxDotStack
	var wy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var whiteThreshTicksEl = drawThreshTicks(svg, wy1, wy2, bucketWidth, graphicWidth)
	var whiteThreshEl = drawThresh(svg,whiteThresh,wy1,wy2,graphicWidth,1, narrowLayout)
	// addLabel(svg,"white defendants",0,wy1-18,label_font_size,"serif","italic")


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
		}
	]

	// bar charts, size & position dynamic to size of svg
	var barYStart = wy2 + (svgHeight - wy2)/3 // bar position starts 1/3 of the way
	barYStart = Math.max(wy2+15,barYStart) // min 20 pixels away from bottom of chart
	
	var barWidth = graphicWidth/3
	barWidth = Math.max(100,Math.min(300,barWidth)) // min & max barWidth
	
	var barXStart = graphicWidth/3
	var barSpacing = 8 // spacing between bars in same group
	var barGroupSpacing = 40 // spacing between grouped bars

	var barData = [
		{
			label: "white",
			y: barYStart,
			color: orange,
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "white",
			y: barYStart+params.barHeight+barGroupSpacing,
			color: orange,
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		}
	]


	for (var b of barData) {
		b.el = drawBar(svg,barXStart,b,barWidth,narrowLayout,numMargin,numSpacing)
	}

	// label bar groups
	var barGroupLabelsX = barXStart-params.labelWidth-60
	var barGroupHeight = 2*params.barHeight+barSpacing

	drawBarGroupLabel(svg,"FPR",barGroupLabelsX,barData[0].y)
	drawBarGroupLabel(svg,"FPR",barGroupLabelsX,barData[1].y)


	// Fraction table labels
	if (!narrowLayout) {
		var numbersX = barXStart+barWidth+numMargin
		var numberLabelY1 = barData[0].y - 30
		var numberLabelY2 = barData[0].y - 18
		addLabel(svg,"High-risk,",numbersX+3*numSpacing,numberLabelY1,10,"sans-serif","italic","")
		addLabel(svg,"not re-arrested",numbersX+3*numSpacing,numberLabelY2,10,"sans-serif","italic","")
		addLabel(svg,"Not re-arrested",numbersX+7*numSpacing,numberLabelY2,10,"sans-serif","italic",)

		var numberLabelY3 = barData[1].y - 30
		var numberLabelY4 = barData[1].y - 18
		addLabel(svg,"Low-risk,",numbersX+3*numSpacing,numberLabelY3,10,"sans-serif","italic","")
		addLabel(svg,"re-arrested",numbersX+3*numSpacing,numberLabelY4,10,"sans-serif","italic","")
		addLabel(svg,"Re-arrested",numbersX+7*numSpacing,numberLabelY4,10,"sans-serif","italic",)
	}

	// called whenever the threshold moves
	function threshChanged(newThresh) {
		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)


}

loadGraphic(drawGraph5)
