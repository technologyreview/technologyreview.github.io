// max-width: 878 px

function drawGraph3() {

	// create svg
	var barChartHeight = 70 // height of bar chart
	var chartHeight = 240 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg

	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	// define constants specific to this graphic
	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10

	var start = 5
	var thresh = bucketWidth*start

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 700 

	// bucket labels
	drawBuckets(svg, keyHeight/2+graphicHeight, bucketWidth)

	// white defendants
	var [d, spacing] = drawDots(svg, fake_score_bw_buckets, orange, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*17

	var threshy1 = keyHeight+chartHeight-maxDotStack
	var threshy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var threshTicksEl = drawThreshTicks(svg, threshy1, threshy2, bucketWidth, graphicWidth)
	var threshEl = drawThresh(svg,thresh,threshy1,threshy2,graphicWidth,1, narrowLayout)
	// addLabel(svg,"all defendants",0,threshy1-18,label_font_size,"serif","italic")


	// add key, position dynamic to size of chart
	var keyx = graphicWidth - 100
	var keyy = threshy1/2-2*keyHeight/3 // starts a quarter of the way between the top of chart and top of slider
	addKey(svg,keyx,keyy,d/2,[orange],strokeWidth)

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

	// bar charts, size & position dynamic to size of svg
	var barYStart = keyHeight+chartHeight+bucketLabelHeight
	barYStart = barYStart + (svgHeight - barYStart)/2 // starts one third

	var barWidth = graphicWidth/3
	barWidth = Math.max(100,Math.min(300,barWidth)) // min & max barWidth
	
	var barXStart = graphicWidth/3
	var barSpacing = 8 // spacing between bars in same group
	var barGroupSpacing = 40 // spacing between grouped bars

	var barData = [
		{
			label: "Acc.",
			y: barYStart,
			color: orange,
			getVal: function() { return acc(fake_score_bw, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		}
	]


	for (var b of barData) {
		b.el = drawBar(svg,barXStart,b,barWidth,narrowLayout,numMargin,numSpacing)
	}

	// label bar groups
	var barGroupLabelsX = barXStart-params.labelWidth-60
	var barGroupHeight = 2*params.barHeight+barSpacing

	// drawBarGroupLabel(svg,"FPR",barGroupLabelsX,barData[0].y)
	// drawBarGroupLabel(svg,"FPR",barGroupLabelsX,barData[1].y)


	// Fraction table labels
	if (!narrowLayout) {
		var numbersX = barXStart+barWidth+numMargin
		var numberLabelY1 = barData[0].y - 30
		var numberLabelY2 = barData[0].y - 18
		addLabel(svg,"Predicted",numbersX+3*numSpacing,numberLabelY1,10,"sans-serif","italic","")
		addLabel(svg,"correctly",numbersX+3*numSpacing,numberLabelY2,10,"sans-serif","italic","")
		addLabel(svg,"All defendants",numbersX+7*numSpacing,numberLabelY2,10,"sans-serif","italic",)

	}

	// called whenever the threshold moves
	function threshChanged(newThresh) {
		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)


}

loadGraphic(drawGraph3)
