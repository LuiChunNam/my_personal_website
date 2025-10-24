// nodelink.js — CityU SCM courses + art mediums network
// Author: GPT-5, 2025

const data = {
  nodes: [
    // --- Art Mediums ---
    { id: "Photography", group: "Medium", size: 12 },
    { id: "Animation", group: "Medium", size: 12 },
    { id: "Game", group: "Medium", size: 12 },
    { id: "Sound", group: "Medium", size: 12 },
    { id: "Interactive Media", group: "Medium", size: 12 },
    { id: "Film", group: "Medium", size: 12 },
    { id: "Installation", group: "Medium", size: 12 },
    { id: "Performance", group: "Medium", size: 12 },
    { id: "AI Art", group: "Medium", size: 12 },
    { id: "Generative Art", group: "Medium", size: 12 },

    // --- SCM Courses ---
    { id: "SM1702 - Creative Media Studio I", group: "Course", size: 28 },
    { id: "SM1703 - Creative Media Studio II", group: "Course", size: 28 },
    { id: "SM2253 - Digital Photography", group: "Course", size: 24 },
    { id: "SM2228 - Understanding Animation", group: "Course", size: 24 },
    { id: "SM3601 - Game Prototyping and Design", group: "Course", size: 24 },
    { id: "SM2722 - Sound Objects", group: "Course", size: 24 },
    { id: "SM2220 - Generative Art", group: "Course", size: 24 },
    { id: "SM2602 - Interactive Installation", group: "Course", size: 24 },
    { id: "SM2704 - Creative Media Studio III", group: "Course", size: 26 },
    { id: "SM3614 - Experimental Film", group: "Course", size: 22 },
    { id: "SM3615 - Performance Art", group: "Course", size: 22 },
    { id: "SM4701 - AI Art and Design", group: "Course", size: 26 }
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
    { source: "SM4701 - AI Art and Design", target: "SM2220 - Generative Art" },
  ]
};

// === SVG SETUP ===
const width = Math.max(1000, window.innerWidth);
const height = Math.max(700, window.innerHeight);

const svg = d3.select("#vis-nodelink")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const color = d3.scaleOrdinal()
  .domain(["Medium", "Course"])
  .range(["#ff8c00", "#1f78b4"]);

// Initial random positions
data.nodes.forEach(d => {
  d.x = width / 2 + (Math.random() - 0.5) * 400;
  d.y = height / 2 + (Math.random() - 0.5) * 300;
});

// === Simulation ===
const simulation = d3.forceSimulation(data.nodes)
  .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => d.group === "Course" ? 120 : 100))
  .force("charge", d3.forceManyBody().strength(d => d.group === "Course" ? -900 : -300))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(d => d.size + 6))
  .alphaDecay(0.03);

// === Draw ===
const link = svg.append("g")
  .attr("stroke", "#aaa")
  .attr("stroke-opacity", 0.7)
  .selectAll("line")
  .data(data.links)
  .join("line")
  .attr("stroke-width", 1.5);

const node = svg.append("g")
  .selectAll("circle")
  .data(data.nodes)
  .join("circle")
  .attr("r", d => d.size)
  .attr("fill", d => color(d.group))
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

const label = svg.append("g")
  .selectAll("text")
  .data(data.nodes)
  .join("text")
  .text(d => d.id)
  .attr("font-size", 11)
  .attr("fill", "#111")
  .attr("pointer-events", "none");

// === Orbit animation for courses ===
const orbitSpeed = 0.0018;
const orbitBase = 10;
const startTime = Date.now();

simulation.on("tick", () => {
  const now = Date.now();

  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.each(function (d, i) {
    let dx = 0, dy = 0;
    if (d.group === "Course") {
      const angle = (now - startTime) * orbitSpeed + i * 0.5;
      const r = orbitBase + (d.size / 4);
      dx = Math.cos(angle) * r;
      dy = Math.sin(angle) * r;
    }
    d3.select(this)
      .attr("cx", d.x + dx)
      .attr("cy", d.y + dy);
  });

  label.each(function (d, i) {
    let dx = 0, dy = 0;
    if (d.group === "Course") {
      const angle = (now - startTime) * orbitSpeed + i * 0.5;
      const r = orbitBase + (d.size / 4);
      dx = Math.cos(angle) * r;
      dy = Math.sin(angle) * r;
    }
    d3.select(this)
      .attr("x", d.x + dx + 12)
      .attr("y", d.y + dy + 4);
  });
});

// === Drag Handlers ===
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}
function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
