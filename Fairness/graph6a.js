// max-width: 878 px

function drawGraph6a() {

	// create svg
	var barChartHeight = 250 // height of bar chart
	var chartHeight = 160 // height of chart area above and below
	var graphicHeight = chartHeight*2 + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg
	var svg = createSVG(svgHeight)

	// default threshold
	var whiteThresh = bucketWidth*start
	var blackThresh = bucketWidth*start

	// bucket labels
	drawBuckets(svg, keyHeight+graphicHeight/2, bucketWidth)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, yellow, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*11

	var wy1 = keyHeight+chartHeight-maxDotStack
	var wy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var whiteThreshTicksEl = drawThreshTicks(svg, wy1, wy2, bucketWidth, graphicWidth)
	var whiteThreshEl = drawThresh(svg,"white",whiteThresh,wy1,wy2,graphicWidth,1, narrowLayout)
	drawText(svg,"white defendants",0,wy1-18,{"font-size":label_font_size,"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight}) 
  

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, keyHeight+chartHeight+bucketLabelHeight, bucketWidth, -1)
	var by1 = keyHeight+chartHeight+bucketLabelHeight-10 // -10 to go over dots
	var by2 = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	var blackThreshTicksEl = drawThreshTicks(svg, by1, by2, bucketWidth, graphicWidth)
	var blackThreshEl = drawThresh(svg,"black",blackThresh,by1,by2,graphicWidth,-1, narrowLayout)
	drawText(svg,"black defendants",0,by2,{"font-size":label_font_size,"font-family":"Independent,serif","font-style":"italic","fill":dimColor,"font-weight":dimWeight})
	
	// COMPAS threshold
	var threshCOMPAS = drawCompasThresh(svg,wy1,by2)

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
	// var barChartPadding = 20
	var barYStart = keyHeight+chartHeight+bucketLabelHeight+maxDotStack
	barYStart = barYStart + (svgHeight - barYStart)/5 // starts one third

	var barXStart = (graphicWidth-barWidth)/2
	var barSpacing = 24 // spacing between bars in same group
	var barGroupSpacing = 60 // spacing between grouped bars

	var barData = [
		{
			label: "WHITE",
			class: "white",
			y: barYStart+2*params.barHeight+barSpacing+barGroupSpacing,
			color: yellow,
			calc: "fpr",
			getVal: function() { return fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "WHITE",
			class: "white",
			y: barYStart,
			color: yellow,
			calc: "fnr",
			getVal: function() { return fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},		
		{
			label: "BLACK",
			class: "black",
			y: barYStart+3*params.barHeight+2*barSpacing+barGroupSpacing,
			color: blue,
			calc: "fpr",
			getVal: function() { return fpr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
		{
			label: "BLACK",
			class: "black",
			y: barYStart+params.barHeight+barSpacing,
			color: blue,
			calc: "fnr",
			getVal: function() { return fnr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)) }
		},
	]


	for (var b of barData) {
		b.el = drawBar(svg,barXStart,b,barWidth,narrowLayout,numMargin,numSpacing,d.class)
	}

	// label bar groups
	var barGroupHeight = 2*params.barHeight+barSpacing

	var fnry = barYStart-20
	var fpry = barYStart+barGroupHeight+barGroupSpacing-20

	addLabel(svg,"RELEASED BUT RE-ARRESTED",barXStart+barWidth/2,fnry,12,"NeueHaas,sans-serif","","",1,"bold","middle")
	addLabel(svg,"NEEDLESSLY JAILED",barXStart+barWidth/2,fpry,12,"NeueHaas,sans-serif","","",1,"bold","middle")
	

	// goals
	var goal0 = 6
	var goal1 = 8


	// called whenever the threshold moves
	function threshChanged(newThresh) {

		var t = d3.transition()
		    .duration(200)
		    .ease(d3.easeLinear);

		// Has the user moved the slider(s) to the target value?
		var slider0 = pixelsToScore(sliderList[0].pos, bucketWidth)
		var slider1 = pixelsToScore(sliderList[1].pos, bucketWidth)

		// turn sliders on and off
		if (slider0 == goal0){
			d3.selectAll(".whiteGoal").transition(t).style("opacity",.8)
		} else {
			d3.selectAll(".whiteGoal").transition(t).style("opacity",0)
		}

		if (slider1 == goal1){
			d3.selectAll(".blackGoal").transition(t).style("opacity",.8)
		} else {
			d3.selectAll(".blackGoal").transition(t).style("opacity",0)
		}

		// update bars
		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)
	drawGoal(svg,goal0,wy1,bucketWidth,"whiteGoal",1)
	drawGoal(svg,goal1,by2,bucketWidth,"blackGoal",-1)
}

loadGraphic(drawGraph6a)
