function drawGraph6() {
	var graphicHeight = 150
	var canvasHeight = graphicHeight*2
	var keyHeight = 40
	var barChartHeight = 60
	var svgHeight = canvasHeight + keyHeight + barChartHeight

	// create svg
	var svg = d3.select("body").append("svg")
		.attr("width","100%")
		.attr("height",svgHeight)

	var graphicWidth = svg.node().getBoundingClientRect().width
	var bucketWidth = graphicWidth/10
	var scaleHeight = 20

	var blackStart = 4
	var whiteStart = 5
	var whiteThresh = bucketWidth*whiteStart
	var blackThresh = bucketWidth*blackStart

	// bucket labels
	drawBuckets(svg, graphicHeight+keyHeight, bucketWidth, scaleHeight)

	// white defendants
	var [d, spacing] = drawDots(svg, real_score_white_buckets, yellow, graphicHeight+keyHeight, bucketWidth, scaleHeight, 1)
	var maxDotStack = (d+spacing)*13

	var wy1 = graphicHeight+keyHeight-scaleHeight-maxDotStack
	var wy2 = graphicHeight+keyHeight-scaleHeight
	var whiteThreshEl =
	  drawThresh(svg,whiteThresh,wy1,wy2,graphicWidth,1)
	var wlabely2 = graphicHeight+keyHeight-scaleHeight-(maxDotStack+20)

	//drawThresh(svg,thresh6_white,keyHeight+20,graphicHeight+keyHeight-scaleHeight,1)
	addLabel(svg,"white defendants",0,wlabely2,"serif","italic")

	// black defendants
	drawDots(svg, real_score_black_buckets, blue, graphicHeight+keyHeight-scaleHeight, bucketWidth, scaleHeight, -1)
	var by1 = graphicHeight+keyHeight
	var by2 = graphicHeight+keyHeight+maxDotStack
	var blackThreshEl = 
	  drawThresh(svg,blackThresh,by1,by2,graphicWidth,-1)
	var blabely2 = graphicHeight+keyHeight+maxDotStack
	addLabel(svg,"black defendants",0,blabely2,"serif","italic")

	addKey(svg,graphicWidth)

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

  // bar chart
  var barYStart = canvasHeight + keyHeight 
  drawBar(svg,0,barYStart,"FPR, white defen.",fpr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)))
  drawBar(svg,300,barYStart,"FNR, white defen.",fnr(real_score_white, pixelsToScore(sliderList[0].pos, bucketWidth)))
  drawBar(svg,0,barYStart+20,"FPR, black defen.",fpr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)))
  drawBar(svg,300,barYStart+20,"FNR, black defen.",fnr(real_score_black, pixelsToScore(sliderList[1].pos, bucketWidth)))
	
		// called whenever the threshold moves
	function threshChanged(newThresh) {
		console.log("black " + pixelsToScore(sliderList[1].pos, bucketWidth))
		console.log("white " + pixelsToScore(sliderList[0].pos, bucketWidth))
	}

	addSliders(svg, sliderList, bucketWidth, graphicWidth, threshChanged)


}

loadGraphic(drawGraph6)
