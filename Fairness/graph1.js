// max-width: 878 px

function drawGraph1() {

	// create svg
	var svgHeight = 220 // height of svg
	var graphicHeight = svgHeight + keyHeight
	var svg = createSVG(graphicHeight)

	// variables
	var ncols = 40
	var bucketMargin = bucketWidth/8
	var spacing = bucketMargin/2.5
	var noise = d3.randomNormal(0,.5)
	var d = (bucketWidth - 2*bucketMargin - 4*spacing)/5 // compute diameter dynamically
	d = Math.max(2,Math.min(10,d))

  	// padding
  	spacing = graphicWidth/ncols - d
  	
  	var top_margin = keyHeight + (svgHeight - Math.ceil(500/ncols)*(d+spacing)-spacing)/2

	// add dots
	for (var i=0;i<500;i++) { // for each dot
	    var row = Math.floor(i/ncols) // calculate row index
	    var col = i%ncols // calculate column index

	    // draw circles
	    var circles = svg.append("circle")
	      .attr("cx", (d+spacing)/2 + col*(d+spacing)+noise()) // convert cx to pixel
	      .attr("cy", top_margin + row*(d+spacing)+noise()) // convert cy to pixel
	      .attr("r", d/2)
	      .style("fill", orange)
	      .style("stroke", orange)
	  }

	// add bespoke key with one circle
	var keyx = 7*graphicWidth/8
	var keyy = keyHeight/4

	svg.append("circle")
      .attr("cx", keyx+d/2)
      .attr("cy", keyy+d)
      .attr("r", d/2)
      .style("fill", orange)
      .style("stroke", orange)
      .style("stroke-width", strokeWidth)

	drawText(svg,"defendant",keyx+2*d,keyy,{"font-size":11,"font-family":"NeueHaas,sans-serif","fill":dimColor, "font-weight":dimWeight, }) 

}

loadGraphic(drawGraph1)
