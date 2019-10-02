// max-width: 878 px

function drawGraph5() {

	// create svg
	var barChartHeight = 115 // height of bar chart
	var chartHeight = 250 // height of chart area above and below
	var graphicHeight = chartHeight + bucketLabelHeight // height of full canvas
	var svgHeight = graphicHeight + keyHeight + barChartHeight // height of svg
	var svg = createSVG(svgHeight)

	var start = 7
	var thresh = bucketWidth*start

	// set threshold for switching to narrow layout
	// (Too narrow to show some things. True for mobile but also narrow desktop)
	var narrowLayout = graphicWidth < 700 

	// bucket labels
	drawBuckets(svg, keyHeight/2+graphicHeight, bucketWidth)

	// add dots
	var [d, spacing] = drawDots(svg, real_score_bw_buckets, orange, keyHeight+chartHeight, bucketWidth, 1)
	var maxDotStack = (d+spacing)*17

	var threshy1 = keyHeight+chartHeight-maxDotStack
	var threshy2 = keyHeight+chartHeight+10 // +10 to go over dots
	var threshTicksEl = drawThreshTicks(svg, threshy1, threshy2, bucketWidth, graphicWidth)
	var threshEl = drawThresh(svg,"",thresh,threshy1,threshy2,graphicWidth,1, narrowLayout)
	
	// COMPAS threshold
	var threshCOMPAS = drawCompasThresh(svg,thresh,threshy1,threshy2)

	// add key, position dynamic to size of chart
	var keyy = threshy1/2-keyHeight/2 // starts a quarter of the way between the top of chart and top of slider
	addKey(svg,keyx,keyy,d/2,spacing,[orange],strokeWidth)

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
	barYStart = barYStart + (svgHeight - barYStart)/3 // starts one third

	var barWidth = graphicWidth/3
	barWidth = Math.max(100,Math.min(300,barWidth)) // min & max barWidth
	
	var barXStart = graphicWidth/3
	var barSpacing = 8 // spacing between bars in same group
	var barGroupSpacing = 40 // spacing between grouped bars

	var barData = [
		{
			label: "",
			y: barYStart,
			color: orange,
			getVal: function() { return fpr(real_score_bw, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		},
		{
			label: "",
			y: barYStart+params.barHeight+barGroupSpacing,
			color: orange,
			getVal: function() { return fnr(real_score_bw, pixelsToScore(sliderList[0].pos, bucketWidth)) }
		}
	]


	for (var b of barData) {
		b.el = drawBar(svg,barXStart,b,barWidth,narrowLayout,numMargin,numSpacing)
	}

	var fpry = barYStart-22
	var fnry = barYStart+params.barHeight+barGroupSpacing-22

	addLabel(svg,"WRONGLY JAILED",barXStart+barWidth/2,fpry,13.5,"sans-serif","","",1,"bold","middle")
	addLabel(svg,"WRONGLY RELEASED",barXStart+barWidth/2,fnry,13.5,"sans-serif","","",1,"bold","middle")

	// // Fraction table labels
	// if (!narrowLayout) {
	// 	var numbersX = barXStart+barWidth+numMargin
	// 	var numberLabelY1 = barData[0].y - 30
	// 	var numberLabelY2 = barData[0].y - 18
	// 	addLabel(svg,"Jailed,",numbersX+3*numSpacing,numberLabelY1,10,"sans-serif","italic","")
	// 	addLabel(svg,"not re-arrested",numbersX+3*numSpacing,numberLabelY2,10,"sans-serif","italic","")
	// 	addLabel(svg,"Not re-arrested",numbersX+7*numSpacing,numberLabelY2,10,"sans-serif","italic",)

	// 	var numberLabelY3 = barData[1].y - 30
	// 	var numberLabelY4 = barData[1].y - 18
	// 	addLabel(svg,"Released,",numbersX+3*numSpacing,numberLabelY3,10,"sans-serif","italic","")
	// 	addLabel(svg,"re-arrested",numbersX+3*numSpacing,numberLabelY4,10,"sans-serif","italic","")
	// 	addLabel(svg,"Re-arrested",numbersX+7*numSpacing,numberLabelY4,10,"sans-serif","italic",)
	// }

	var goal = 8

	// called whenever the threshold moves
	function threshChanged(newThresh) {

		var t = d3.transition()
		    .duration(200)
		    .ease(d3.easeLinear);

		// Has the user moved the slider(s) to the target value?
		var slider = pixelsToScore(sliderList[0].pos, bucketWidth)

		// turn sliders on and off
		if (slider == goal){
			d3.selectAll(".goal").transition(t).style("opacity",.8)
		} else {
			d3.selectAll(".goal").transition(t).style("opacity",0)
		}

		for (var b of barData) {
  		updateBar(b,barWidth)		
		}
	}
	
	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)
	drawGoal(svg,goal,threshy1,bucketWidth,"goal",1)

}

loadGraphic(drawGraph5)
