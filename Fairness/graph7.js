// max-width: 878 px

function drawGraph7() {

	// create svg
	var barChartHeight = 250 // height of bar chart
	var chartHeight = 160 // height of chart area above and below
	var graphicHeight = chartHeight*2 + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg
	var svg = createSVG(svgHeight)

	// default threshold
	var start = 7
	var thresh = bucketWidth*start

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 700 

	// bucket labels
	drawBuckets(svg, keyHeight+graphicHeight/2, bucketWidth)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, yellow, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*11

	var wy1 = keyHeight+chartHeight-maxDotStack
	var wy2 = keyHeight+chartHeight+10 // +10 to go over dots
	addLabel(svg,"white defendants",0,wy1-18,label_font_size,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, keyHeight+chartHeight+bucketLabelHeight, bucketWidth, -1)
	var by1 = keyHeight+chartHeight+bucketLabelHeight-10 // -10 to go over dots
	var by2 = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	addLabel(svg,"black defendants",0,by2,label_font_size,"serif","italic")

	// draw single threshold
	var threshTicksEl = drawThreshTicks(svg, wy1, by2, bucketWidth, graphicWidth)
	var threshEl = drawThresh(svg,"white",thresh,wy1,by2,graphicWidth,1, narrowLayout)

	// COMPAS threshold
	var threshCOMPAS = drawCompasThresh(svg,thresh,wy1,by2)

	// add key, position dynamic to size of chart
	var keyy = wy1/2-2*keyHeight/3 // starts a quarter of the way between the top of chart and top of slider
	
	addKey(svg,keyx,keyy,d/2,spacing,[yellow,blue],strokeWidth)

	var sliderList = [ 
		{
		  dragging: false,
		  el: threshEl,
		  ticksEl: threshTicksEl,
		  pos: thresh,
		  y1: wy1,
		  y2: by2,
		  // label: "white"
		}
	]

	// bar charts, size & position dynamic to size of svg
	var barYStart = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	barYStart = barYStart + (svgHeight - barYStart)/5 // starts one third

	var barXStart = (graphicWidth-barWidth)/2
	var barSpacing = 24 // spacing between bars in same group
	var barGroupSpacing = 60 // spacing between grouped bars

	var barData = [
		{
			label: "WHITE",
			class: "whiteStay",
			y: barYStart,
			color: yellow,
			calc:"fpr",
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "WHITE",
			class: "whiteStay",
			y: barYStart+2*params.barHeight+barSpacing+barGroupSpacing,
			color: yellow,
			calc:"fnr",
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},		
		{
			label: "BLACK",
			class: "blackStay",
			y: barYStart+params.barHeight+barSpacing,
			color: blue,
			calc:"fpr",
			getVal: function() { return fpr(real_score_black, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "BLACK",
			class: "blackStay",
			y: barYStart+3*params.barHeight+2*barSpacing+barGroupSpacing,
			color: blue,
			calc:"fnr",
			getVal: function() { return fnr(real_score_black, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
	]


	for (var b of barData) {
		b.el = drawBar(svg,barXStart,b,barWidth,narrowLayout,numMargin,numSpacing)
	}

	// label bar groups
	var barGroupLabelsX = barXStart
	var barGroupHeight = 2*params.barHeight+barSpacing

	var fpry = barYStart-22
	var fnry = barYStart+barGroupHeight+barGroupSpacing-22

	addLabel(svg,"WRONGLY JAILED",barXStart+barWidth/2,fpry,13.5,"sans-serif","","",1,"bold","middle")
	addLabel(svg,"WRONGLY RELEASED",barXStart+barWidth/2,fnry,13.5,"sans-serif","","",1,"bold","middle")

	// called whenever the threshold moves
	function threshChanged(newThresh) {

		// update bars
		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)

}

loadGraphic(drawGraph7)
