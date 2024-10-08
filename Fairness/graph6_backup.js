// max-width: 878 px

function drawGraph6() {

	// create svg
	var barChartHeight = 190 // height of bar chart
	var chartHeight = 160 // height of chart area above and below
	var graphicHeight = chartHeight*2 + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg
	var svg = createSVG(svgHeight)

	// default threshold
	var blackStart = 7
	var whiteStart = 7
	var whiteThresh = bucketWidth*whiteStart
	var blackThresh = bucketWidth*blackStart

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
	var whiteThreshTicksEl = drawThreshTicks(svg, wy1, wy2, bucketWidth, graphicWidth)
	var whiteThreshEl = drawThresh(svg,"white",whiteThresh,wy1,wy2,graphicWidth,1, narrowLayout)
	addLabel(svg,"white defendants",0,wy1-18,label_font_size,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, keyHeight+chartHeight+bucketLabelHeight, bucketWidth, -1)
	var by1 = keyHeight+chartHeight+bucketLabelHeight-10 // -10 to go over dots
	var by2 = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	var blackThreshTicksEl = drawThreshTicks(svg, by1, by2, bucketWidth, graphicWidth)
	var blackThreshEl = drawThresh(svg,"black",blackThresh,by1,by2,graphicWidth,-1, narrowLayout)
	addLabel(svg,"black defendants",0,by2,label_font_size,"serif","italic")

	// COMPAS threshold
	var threshCOMPAS = drawCompasThresh(svg,whiteThresh,wy1,by2)

	// add key, position dynamic to size of chart
	var keyy = wy1/2-2*keyHeight/3 // starts a quarter of the way between the top of chart and top of slider
	
	addKey(svg,keyx,keyy,d/2,spacing,[yellow,blue],strokeWidth)

	var sliderList = [ 
		{
		  dragging: false,
		  el: whiteThreshEl,
		  ticksEl: whiteThreshTicksEl,
		  pos: whiteThresh,
		  y1: wy1,
		  y2: wy2,
		  label: "white"
		},
		{
		  dragging: false,
		  el: blackThreshEl,
		  ticksEl: blackThreshTicksEl,
		  pos: blackThresh,
		  y1: by1,
		  y2: by2,
		  label: "black"
		}
	]

	// bar charts, size & position dynamic to size of svg
	var barYStart = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	barYStart = barYStart + (svgHeight - barYStart)/2 - barChartHeight/6 // starts one third

	var barWidth = graphicWidth/3
	barWidth = Math.max(100,Math.min(300,barWidth)) // min & max barWidth
	
	var barXStart = graphicWidth/3
	var barSpacing = 8 // spacing between bars in same group
	var barGroupSpacing = 40 // spacing between grouped bars

	var barData = [
		{
			label: "white",
			class: "whiteGone",
			y: barYStart,
			color: yellow,
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "white",
			class: "whiteGone",
			y: barYStart+2*params.barHeight+barSpacing+barGroupSpacing,
			color: yellow,
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},		
		{
			label: "black",
			class: "blackGone",
			y: barYStart+params.barHeight+barSpacing,
			color: blue,
			getVal: function() { return fpr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
		{
			label: "black",
			class: "blackGone",
			y: barYStart+3*params.barHeight+2*barSpacing+barGroupSpacing,
			color: blue,
			getVal: function() { return fnr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
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

	addLabel(svg,"wrongly jailed",barGroupLabelsX,fpry,13.5,"sans-serif","italic","",1)
	addLabel(svg,"wrongly released",barGroupLabelsX,fnry,13.5,"sans-serif","italic","",1)


	// Fraction table labels
	if (!narrowLayout) {
		var numbersX = barXStart+barWidth+numMargin
		var numberLabelY1 = barData[0].y - 30
		var numberLabelY2 = barData[0].y - 18
		addLabel(svg,"Jailed,",numbersX+3*numSpacing,numberLabelY1,10,"sans-serif","italic","")
		addLabel(svg,"not re-arrested",numbersX+3*numSpacing,numberLabelY2,10,"sans-serif","italic","")
		addLabel(svg,"Not re-arrested",numbersX+7*numSpacing,numberLabelY2,10,"sans-serif","italic",)

		var numberLabelY3 = barData[1].y - 30
		var numberLabelY4 = barData[1].y - 18
		addLabel(svg,"Released,",numbersX+3*numSpacing,numberLabelY3,10,"sans-serif","italic","")
		addLabel(svg,"re-arrested",numbersX+3*numSpacing,numberLabelY4,10,"sans-serif","italic","")
		addLabel(svg,"Re-arrested",numbersX+7*numSpacing,numberLabelY4,10,"sans-serif","italic",)
	}


	// goals
	var goal0 = 6
	var goal1 = 8


	// called whenever the threshold moves
	function threshChanged(newThresh) {

		// update bars
		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)


}

loadGraphic(drawGraph6)
