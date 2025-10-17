/* var title = document.querySelector("h1");
title.innerHTML = "This is another title from code.js!";

var button = document.querySelector("#CV");
button.addEventListener("click", myfunction);

function myfunction(){
    alert("Let me tell you more about me!");
}

var mynode = document.createElement("div");
mynode.id = "work1_intro";
mynode.innerHTML = "The work is an exhibition";
mynode.style.color = "blue";

mynode.addEventListener("click", welcomeToWork1);

document.querySelector("#my_work1").appendChild(mynode);

function welcomeToWork1(){
    mynode.innerHTML = "Thank you for your interest in my work!";
} */




/* const data = [
    { year: 2018, type: "Film", count: 2 },
    { year: 2019, type: "Film", count: 4 },
    { year: 2020, type: "Film", count: 6 },
    { year: 2021, type: "Film", count: 8 },
    { year: 2022, type: "Film", count: 10 },
    { year: 2023, type: "Film", count: 12 },
    { year: 2024, type: "Film", count: 14 },
    { year: 2025, type: "Film", count: 16 }
];

function createDonutChart() {
    const width = 600;
    const height = 600;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG container
    const svg = d3.select("#vis-scatterplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.year))
        .range(d3.schemeTableau10);

    // Pie generator
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const data_ready = pie(data);

    // Arc generator for donut
    const arc = d3.arc()
        .innerRadius(radius * 0.5) // inner radius for donut hole
        .outerRadius(radius);

    // Arc generator for labels
    const outerArc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.7);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "white")
        .style("padding", "6px 10px")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none");

    // Draw slices
    svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.year))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('transform', 'scale(1.05)');
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Year: ${d.data.year}<br>Films: ${d.data.count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('transform', 'scale(1)');
            tooltip.transition()
                .duration(400)
                .style("opacity", 0);
        });

    // Add labels
    svg.selectAll('text.label')
        .data(data_ready)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            return `translate(${pos[0]}, ${pos[1]})`;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#000')
        .text(d => `${d.data.year}: ${d.data.count} Films`);

    // Add title
    svg.append("text")
        .attr("x", 0)
        .attr("y", - (height / 2) + margin)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Number of Films Produced Each Year");
}

// Draw the donut chart
createDonutChart();
 */

// code.js
(function () {

    

  // Strength categories data
  const data = [
    { category: "Analytical", value: 8 },
    { category: "Creative", value: 9 },
    { category: "Leadership", value: 7 },
    { category: "Communication", value: 8 },
    { category: "Adaptability", value: 6 },
    { category: "Resilience", value: 9 }
  ];

  // Get the container element
  const container = d3.select("#vis-scatterplot");
  
  // Remove the existing h2 title since we'll add it in the SVG
  container.select("h2").remove();

  // Dimensions
  const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  // SVG container
  const svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left + width/2}, ${margin.top + height/2})`);

  // Create tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("font-size", "14px")
    .style("opacity", 0);

  // Color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.category))
    .range(d3.schemeSet2);

  // Create legend
  const legend = container.append("div")
    .attr("class", "legend")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("flex-wrap", "wrap")
    .style("margin-top", "20px")
    .style("gap", "15px");

  data.forEach(d => {
    const legendItem = legend.append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin", "0 10px");

    legendItem.append("div")
      .attr("class", "legend-color")
      .style("width", "15px")
      .style("height", "15px")
      .style("border-radius", "3px")
      .style("margin-right", "5px")
      .style("background-color", color(d.category));

    legendItem.append("span")
      .text(d.category);
  });

  // Hexagon parameters
  const numSides = 6;
  const maxValue = 10;
  const angleSlice = Math.PI * 2 / numSides;

  // Create scales
  const radiusScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, Math.min(width, height) / 2 - 40]);

  // Draw hexagon grid
  const levels = 5;
  const levelStep = maxValue / levels;
  
  for (let level = 1; level <= levels; level++) {
    const radius = radiusScale(level * levelStep);
    
    // Draw hexagon
    const hexagonPoints = [];
    for (let i = 0; i < numSides; i++) {
      const angle = i * angleSlice - Math.PI / 2;
      hexagonPoints.push([
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ]);
    }
    
    // Close the hexagon
    hexagonPoints.push(hexagonPoints[0]);
    
    // Draw hexagon line
    svg.append("path")
      .datum(hexagonPoints)
      .attr("d", d3.line())
      .style("fill", "none")
      .style("stroke", "#e0e0e0")
      .style("stroke-width", 1);
    
    // Add level labels
    svg.append("text")
      .attr("x", 0)
      .attr("y", -radius - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#999")
      .text(level * levelStep);
  }

  // Draw axis lines
  for (let i = 0; i < numSides; i++) {
    const angle = i * angleSlice - Math.PI / 2;
    const x2 = radiusScale(maxValue) * Math.cos(angle);
    const y2 = radiusScale(maxValue) * Math.sin(angle);
    
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", x2)
      .attr("y2", y2)
      .style("stroke", "#bdc3c7")
      .style("stroke-width", 1);
  }

  // Calculate strength points
  const strengthPoints = data.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const radius = radiusScale(d.value);
    return {
      category: d.category,
      value: d.value,
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      angle: angle
    };
  });

  // Draw connecting area
  const areaPoints = [...strengthPoints, strengthPoints[0]]; // Close the polygon
  
  svg.append("path")
    .datum(areaPoints)
    .attr("d", d3.line()
      .x(d => d.x)
      .y(d => d.y)
    )
    .style("fill", "url(#areaGradient)")
    .style("stroke", "none")
    .style("opacity", 0.3);

  // Create gradient for the area
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "areaGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");
  
  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "steelblue");
  
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "purple");

  // Draw connecting lines between points
  for (let i = 0; i < strengthPoints.length; i++) {
    const nextIndex = (i + 1) % strengthPoints.length;
    svg.append("line")
      .attr("x1", strengthPoints[i].x)
      .attr("y1", strengthPoints[i].y)
      .attr("x2", strengthPoints[nextIndex].x)
      .attr("y2", strengthPoints[nextIndex].y)
      .style("stroke", "#95a5a6")
      .style("stroke-width", 1.5)
      .style("stroke-dasharray", "3,3");
  }

  // Draw strength points
  svg.selectAll(".strength-point")
    .data(strengthPoints)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 6)
    .style("fill", d => color(d.category))
    .style("fill-opacity", 0.8)
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("transition", "all 0.2s ease")
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1)
        .html(`<strong>${d.category}</strong><br/>Strength: ${d.value}/10`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
      
      d3.select(this)
        .attr("r", 8)
        .style("fill-opacity", 1)
        .style("stroke-width", 3);
    })
    .on("mouseout", function(event, d) {
      tooltip.style("opacity", 0);
      d3.select(this)
        .attr("r", 6)
        .style("fill-opacity", 0.8)
        .style("stroke-width", 2);
    });

  // Add axis labels (strength categories)
  strengthPoints.forEach(d => {
    const labelRadius = radiusScale(maxValue) + 20;
    const labelX = labelRadius * Math.cos(d.angle);
    const labelY = labelRadius * Math.sin(d.angle);
    
    svg.append("text")
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#2c3e50")
      .text(d.category);
  });

  // Add chart title
  svg.append("text")
    .attr("x", 0)
    .attr("y", -height/2 - 12)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Personal Strengths Hexagon");

})();