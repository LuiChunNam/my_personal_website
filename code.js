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


// scatterplot.js

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

function createScatterplot() {
    const margin = { top: 30, right: 40, bottom: 60, left: 100 };
    const containerWidth = 800;
    const containerHeight = 500;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select("#vis-scatterplot")
        .append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([2018, 2025])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text("Count of Creative Work");

    // Add title for the scatterplot
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Perfect Positive Correlation");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.count))
        .attr("r", 5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "darkred").attr("stroke-width", 2);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Year: ${d.year}<br>Count: ${d.count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 1);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

// Call the function to create the scatterplot
createScatterplot();