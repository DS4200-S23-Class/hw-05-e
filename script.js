// set up constants
const width = 600;
const height = 400;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = 10;

// create SVG element
const svgScatter = d3.select('#scatterplot')
  .attr('width', width)
  .attr('height', height);

// create scales
const xScale = d3.scaleLinear()
  .domain([0, 9])
  .range([0, innerWidth]);

const yScale = d3.scaleLinear()
  .domain([0, 9])
  .range([innerHeight, 0]);

// create axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// add axis to SVG
svgScatter.append('g')
  .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
  .call(xAxis);

svgScatter.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .call(yAxis);

// load data and draw scatterplot
d3.csv('data/scatter-data.csv', (d) => {
    // coerce data to numbers
    d.x = +d.x;
    d.y = +d.y;
    d.selected = false;
    return d;
  }).then((data) => {
    svgScatter.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x) + margin.left)
      .attr('cy', d => yScale(d.y) + margin.top)
      .attr('r', radius)
      .attr('fill', 'blue')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        if (!d.selected) {
          d3.select(event.currentTarget)
            .attr('fill', 'orange');
        }
      })
      .on('mouseout', (event, d) => {
        if (!d.selected) {
          d3.select(event.currentTarget)
            .attr('fill', 'blue');
        }
      })
      .on('click', (event, d) => {
        const point = d3.select(event.currentTarget);
        if (!d.selected) {
          point.attr('stroke', 'black');
          d.selected = true;
          d3.select('#selected-point')
            .text(`Last point clicked: (${d.x}, ${d.y})`);
        } else {
          point.attr('stroke', 'white');
          d.selected = false;
        }
      });
  });

const form = d3.select('#new-point-form');

form.on('submit', (event) => {
	event.preventDefault();
	
	const x = +d3.select('#x-coordinate').property('value');
	const y = +d3.select('#y-coordinate').property('value');

	const newData = { x, y, selected: false };
	
	svgScatter.append('circle')
		.datum(newData)
		.attr('cx', d => xScale(d.x) + margin.left)
		.attr('cy', d => yScale(d.y) + margin.top)
		.attr('r', radius)
		.attr('fill', 'blue')
		.attr('stroke', 'white')
		.attr('stroke-width', 2)
		.on('mouseover', (event, d) => {
			if (!d.selected) {
				d3.select(event.currentTarget)
					.attr('fill', 'orange');
			}
		})
		.on('mouseout', (event, d) => {
			if (!d.selected) {
				d3.select(event.currentTarget)
					.attr('fill', 'blue');
			}
		})
		.on('click', (event, d) => {
			const point = d3.select(event.currentTarget);
			if (!d.selected) {
				point.attr('stroke', 'black');
				d.selected = true;
				d3.select('#selected-point')
					.text(`Last point clicked: (${d.x}, ${d.y})`);
			} else {
				point.attr('stroke', 'white');
				d.selected = false;
			}
		});
});

// create SVG Bar chart
const svgBar = d3.select('#bar-chart')
.attr('width', width)
.attr('height', height);

// create tooltip
const tooltip = d3.select("#tooltip")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden");

// load data and draw bar chart
d3.csv('data/bar-data.csv', (d) => {
// coerce data to numbers
d.value = +d.amount;
return d;
}).then((data) => {
		// create scales
		const xScaleBar = d3.scaleBand()
		.range([0, innerWidth])
		.domain(data.map(d => d.category))
		.paddingInner(0.2)
		.paddingOuter(0.2);
	
		const yScaleBar = d3.scaleLinear()
		.range([innerHeight, 0])
		.domain([0, d3.max(data, d => d.value)]);
	
		// create axis
		const xAxisBar = d3.axisBottom(xScaleBar)
		const yAxisBar = d3.axisLeft(yScaleBar)
	
		// add axis to svgBar
		svgBar.append('g')
		.attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
		.call(xAxisBar);
	
		svgBar.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.call(yAxisBar);
	
	// add bars to svgBar
	svgBar.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', d => xScaleBar(d.category) + margin.left)
		.attr('y', d => yScaleBar(d.value) + margin.top)
		.attr('width', xScaleBar.bandwidth())
		.attr('height', d => innerHeight - yScaleBar(d.value))
		.attr('fill', 'blue')
			.on('mouseover', function(d) {
				// Show tooltip
				tooltip.text(`Category: ${d.category}, Amount: ${d.value}`)
					.style('visibility', 'visible')
					.style('top', `${d3.event.pageY + 10}px`)
					.style('left', `${d3.event.pageX + 10}px`);
	
				// highlight the bar
				d3.select(this)
					.attr('fill', 'orange');
			})
			.on('mouseout', function(d) {
				// hide the tooltip and unhighlight the bar
				tooltip.style('visibility', 'hidden');
	
				d3.select(this)
					.attr('fill', 'blue');
			});
		});
	
