// max-width: 878 px

function drawGraph1() {

	// create svg
	var svgHeight = 220 // height of svg
	var svg = createSVG(svgHeight)

	// variables
	var ncols = 40
	var bucketMargin = bucketWidth/12
	var spacing = bucketMargin/2.5
	var d = (bucketWidth - 2*bucketMargin - 4*spacing)/5 // compute diameter dynamically
	d = Math.max(2,Math.min(10,d))

  	// padding
  	spacing = graphicWidth/ncols - d
  	
  	var top_margin = (svgHeight - Math.ceil(500/ncols)*(d+spacing)-spacing)/2

	// add dots
	for (var i=0;i<500;i++) { // for each dot
	    var row = Math.floor(i/ncols) // calculate row index
	    var col = i%ncols // calculate column index

	    // draw circles
	    var circles = svg.append("circle")
	      .attr("cx", (d+spacing)/2 + col*(d+spacing)) // convert cx to pixel
	      .attr("cy", top_margin + row*(d+spacing)) // convert cy to pixel
	      .attr("r", d/2)
	      .style("fill", orange)
	      .style("stroke", orange)
	  }
}

loadGraphic(drawGraph1)
