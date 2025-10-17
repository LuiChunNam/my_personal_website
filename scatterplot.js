// scatterplot.js
(function () {

  // Example dataset
  const data = [
    { year: 2020, type: "Painting", count: 5 },
    { year: 2021, type: "Painting", count: 8 },
    { year: 2020, type: "Music", count: 3 },
    { year: 2021, type: "Music", count: 10 },
    { year: 2022, type: "Video", count: 6 },
    { year: 2023, type: "Sculpture", count: 4 },
    { year: 2023, type: "Music", count: 9 }
  ];



  // Dimensions
  const margin = { top: 60, right: 30, bottom: 60, left: 60 }, // increased top margin
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // SVG container
  const svg = d3.select("#vis-scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add padding on x-scale so dots don't stick to the y-axis
  const x = d3.scaleLinear()
    .domain([
      d3.min(data, d => d.year) - 0.3,
      d3.max(data, d => d.year) + 0.3
    ])
    .range([0, width]);

  const types = [...new Set(data.map(d => d.type))];
  const y = d3.scalePoint()
    .domain(types)
    .range([height, 0])
    .padding(0.5);

  const size = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.count)])
    .range([3, 25]); // circle size

  const color = d3.scaleOrdinal()
    .domain(types)
    .range(d3.schemeSet2);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Circles
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.type))
    .attr("r", d => size(d.count))
    .attr("fill", d => color(d.type))
    .attr("opacity", 0.7);

  // Axis labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Year");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Type of Creative Work");

  // Add chart title on top
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20) // position above the plot area
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Creative Work Output by Year and Type");

})();
