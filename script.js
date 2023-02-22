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


// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

// create the svg canvas
var svg = d3.select("#bar-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read the data from CSV file
d3.csv("bar-data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.Value = +d.Value;
  });

  // set the domains of x and y
  x.domain(data.map(function(d) { return d.Category; }));
  y.domain([0, d3.max(data, function(d) { return d.Value; })]);

  // draw the x axis
  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

  // draw the y axis
  svg.append("g")
     .call(d3.axisLeft(y));

  // draw the bars
  var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.Category); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.Value); })
                .attr("height", function(d) { return height - y(d.Value); })
                .on("mouseover", function(d) { // highlight the bar on hover
                  d3.select(this).classed("highlight", true);
                  // show the tooltip with the bar's values
                  d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .html("<strong>" + d.Category + "</strong><br>" + d.Value);
                  d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) { // unhighlight the bar on mouseout
                  d3.select(this).classed("highlight", false);
                  d3.select("#tooltip").classed("hidden", true);
                });
});

// create the tooltip
var tooltip = d3.select("#bar-chart")
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "hidden")
                .html("");
 



