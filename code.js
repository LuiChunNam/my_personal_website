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




const data = [
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
