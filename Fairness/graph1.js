// max-width: 878 px

function drawGraph1() {

	// create svg
	var svgHeight = 220 // height of svg
	var svg = createSVG(svgHeight)

	// variables
	var ncols = 40
	var bucketMargin = bucketWidth/8
	var spacing = bucketMargin/2.5
	var noise = d3.randomNormal(0,.5)
	var d = (bucketWidth - 2*bucketMargin - 4*spacing)/5 // compute diameter dynamically
  	d = Math.max(2,Math.min(10,d))

  	// padding
  	spacing = 616/ncols - d
  	var side_margin = (graphicWidth - ncols*(d+spacing)-spacing)/2
  	var top_margin = (svgHeight - Math.ceil(500/ncols)*(d+spacing)-spacing)/2

	// add dots
	for (var i=0;i<500;i++) { // for each dot
	    var row = Math.floor(i/ncols) // calculate row index
	    var col = i%ncols // calculate column index

	    // draw circles
	    var circles = svg.append("circle")
	      .attr("cx", side_margin + col*(d+spacing)+noise()) // convert cx to pixel
	      .attr("cy", top_margin + row*(d+spacing)+noise()) // convert cy to pixel
	      .attr("r", d/2)
	      .style("fill", orange)
	      .style("stroke", orange)
	  }

	// add bespoke key with one circle
	var keyx = graphicWidth-5*side_margin/6
	var keyy = top_margin+3*d+2*spacing

	svg.append("circle")
      .attr("cx", keyx+d/2)
      .attr("cy", keyy+d/2)
      .attr("r", d/2)
      .style("fill", orange)
      .style("stroke", orange)
      .style("stroke-width", strokeWidth)

	drawText(svg,"defendant",keyx+2*d,keyy-2,{"font-size":11,"font-family":"NeueHaas,sans-serif","fill":dimColor, "font-weight":dimWeight, }) 

}

loadGraphic(drawGraph1)
