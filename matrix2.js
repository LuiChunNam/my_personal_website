// matrix.js — adjacency matrix for SCM courses vs. art mediums
// Author: GPT-5, 2025

// Reuse your same data structure
const data = {
  nodes: [
    // --- Art Mediums ---
    { id: "Photography", group: "Medium" },
    { id: "Animation", group: "Medium" },
    { id: "Game", group: "Medium" },
    { id: "Sound", group: "Medium" },
    { id: "Interactive Media", group: "Medium" },
    { id: "Film", group: "Medium" },
    { id: "Installation", group: "Medium" },
    { id: "Performance", group: "Medium" },
    { id: "AI Art", group: "Medium" },
    { id: "Generative Art", group: "Medium" },

    // --- SCM Courses ---
    { id: "SM1702 - Creative Media Studio I", group: "Course" },
    { id: "SM1703 - Creative Media Studio II", group: "Course" },
    { id: "SM2253 - Digital Photography", group: "Course" },
    { id: "SM2228 - Understanding Animation", group: "Course" },
    { id: "SM3601 - Game Prototyping and Design", group: "Course" },
    { id: "SM2722 - Sound Objects", group: "Course" },
    { id: "SM2220 - Generative Art", group: "Course" },
    { id: "SM2602 - Interactive Installation", group: "Course" },
    { id: "SM2704 - Creative Media Studio III", group: "Course" },
    { id: "SM3614 - Experimental Film", group: "Course" },
    { id: "SM3615 - Performance Art", group: "Course" },
    { id: "SM4701 - AI Art and Design", group: "Course" }
  ],
  links: [
    // Photography
    { source: "Photography", target: "SM1702 - Creative Media Studio I" },
    { source: "Photography", target: "SM2253 - Digital Photography" },
    // Animation
    { source: "Animation", target: "SM1703 - Creative Media Studio II" },
    { source: "Animation", target: "SM2228 - Understanding Animation" },
    // Game
    { source: "Game", target: "SM3601 - Game Prototyping and Design" },
    { source: "Game", target: "SM1703 - Creative Media Studio II" },
    // Sound
    { source: "Sound", target: "SM2722 - Sound Objects" },
    { source: "Sound", target: "SM1702 - Creative Media Studio I" },
    // Interactive Media
    { source: "Interactive Media", target: "SM2602 - Interactive Installation" },
    { source: "Interactive Media", target: "SM2220 - Generative Art" },
    // Film
    { source: "Film", target: "SM3614 - Experimental Film" },
    { source: "Film", target: "SM1703 - Creative Media Studio II" },
    // Installation
    { source: "Installation", target: "SM2602 - Interactive Installation" },
    { source: "Installation", target: "SM2704 - Creative Media Studio III" },
    // Performance
    { source: "Performance", target: "SM3615 - Performance Art" },
    { source: "Performance", target: "SM1702 - Creative Media Studio I" },
    // AI Art
    { source: "AI Art", target: "SM4701 - AI Art and Design" },
    { source: "AI Art", target: "SM2220 - Generative Art" },
    // Generative Art
    { source: "Generative Art", target: "SM2220 - Generative Art" },
    { source: "Generative Art", target: "SM4701 - AI Art and Design" },
    // Interconnections between courses
    { source: "SM1702 - Creative Media Studio I", target: "SM1703 - Creative Media Studio II" },
    { source: "SM1703 - Creative Media Studio II", target: "SM2704 - Creative Media Studio III" },
    { source: "SM2704 - Creative Media Studio III", target: "SM3601 - Game Prototyping and Design" },
    { source: "SM2704 - Creative Media Studio III", target: "SM3614 - Experimental Film" },
    { source: "SM2602 - Interactive Installation", target: "SM2220 - Generative Art" },
    { source: "SM4701 - AI Art and Design", target: "SM2220 - Generative Art" }
  ]
};

// === SETUP ===
const margin = { top: 180, right: 10, bottom: 10, left: 200 };
const cellSize = 22;
const nodes = data.nodes;
const n = nodes.length;
const width = margin.left + margin.right + cellSize * n;
const height = margin.top + margin.bottom + cellSize * n;

// Create matrix from links
const matrix = [];
nodes.forEach((a, i) => {
  nodes.forEach((b, j) => {
    matrix.push({ x: j, y: i, source: a.id, target: b.id, linked: 0 });
  });
});

data.links.forEach(link => {
  const i = nodes.findIndex(n => n.id === link.source);
  const j = nodes.findIndex(n => n.id === link.target);
  if (i >= 0 && j >= 0) {
    matrix.find(d => d.x === j && d.y === i).linked = 1;
    matrix.find(d => d.x === i && d.y === j).linked = 1;
  }
});

const svg = d3.select("#vis-matrix2")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const color = d3.scaleOrdinal()
  .domain(["Medium", "Course"])
  .range(["#ff8c00", "#1f77b4"]);

svg.append("rect")
  .attr("width", cellSize * n)
  .attr("height", cellSize * n)
  .attr("x", margin.left)
  .attr("y", margin.top)
  .attr("fill", "#f5f5f5");

// === Draw cells ===
svg.append("g")
  .selectAll("rect")
  .data(matrix)
  .join("rect")
  .attr("class", "cell")
  .attr("x", d => margin.left + d.x * cellSize)
  .attr("y", d => margin.top + d.y * cellSize)
  .attr("width", cellSize)
  .attr("height", cellSize)
  .attr("fill", d => d.linked ? "#1f77b4" : "#e0e0e0")
  .attr("opacity", d => d.linked ? 0.9 : 0.15);

// === Row Labels ===
svg.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .attr("x", margin.left - 10)
  .attr("y", (d, i) => margin.top + i * cellSize + cellSize / 1.5)
  .attr("text-anchor", "end")
  .attr("fill", d => color(d.group))
  .text(d => d.id);

// === Column Labels ===
svg.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .attr("x", (d, i) => margin.left + i * cellSize + cellSize / 2)
  .attr("y", margin.top - 5)
  .attr("text-anchor", "start")
  .attr("transform", (d, i) => `rotate(-90, ${margin.left + i * cellSize + cellSize / 2}, ${margin.top - 5})`)
  .attr("fill", d => color(d.group))
  .text(d => d.id);
