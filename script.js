// set up constants
const width = 600;
const height = 400;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = 10;

// create SVG element
const svg = d3.select('#scatterplot')
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
svg.append('g')
  .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
  .call(xAxis);

svg.append('g')
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
    svg.selectAll('circle')
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
	
	svg.append('circle')
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

// create SVG element
const svg2 = d3.select('#barchart')
  .attr('width', width)
  .attr('height', height);

// create scales
const xScale2 = d3.scaleLinear()
  .domain([0, 9])
  .range([0, innerWidth]);

const yScale2 = d3.scaleLinear()
  .domain([0, 9])
  .range([innerHeight, 0]);

// create axis
const xAxis2 = d3.axisBottom(xScale);
const yAxis2 = d3.axisLeft(yScale);

// add axis to SVG
svg.append('g')
  .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
  .call(xAxis);

svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .call(yAxis);






