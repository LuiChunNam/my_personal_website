// --- symbolmap.js ---

// Ensure this script runs AFTER D3.js is loaded in your HTML.
(function() {
    // --- Configuration ---
    const width = 1200;
    const height = 1400;
    const geoJsonUrl = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson";
    
    const cityPool = [
        {name:"Tokyo", coords:[139.6917, 35.6895]},
        {name:"Osaka", coords:[135.5023, 34.6937]},
        {name:"Sapporo", coords:[141.3545, 43.0618]},
        {name:"Fukuoka", coords:[130.4018, 33.5902]},
        {name:"Nagoya", coords:[136.9056, 35.1815]},
        {name:"Sendai", coords:[140.8648, 38.2687]},
        {name:"Hiroshima", coords:[133.2538, 34.3963]},
        {name:"Naha", coords:[127.6809, 26.2124]},
        {name:"Kanazawa", coords:[136.6271, 36.5611]},
        {name:"Kyoto", coords:[135.7681, 35.0116]}
    ];

    // Scaling Configuration for Map 2
    const MIN_R = 4;
    const MAX_R = 20;
    const SCALE_FACTOR = 1.8; 

    // --- Helper Function ---
    function aggregateData(data) {
        const counts = {};
        data.forEach(visitor => {
            const loc = visitor.location;
            if (!counts[loc]) {
                // Store location data needed for projection
                counts[loc] = { location: loc, coords: visitor.coords, count: 0 };
            }
            counts[loc].count++;
        });
        
        return Object.values(counts).map(d => {
            // Calculate radius based on count, ensuring a minimum size
            d.radius = MIN_R + Math.min(MAX_R - MIN_R, (d.count - 1) * SCALE_FACTOR);
            return d;
        });
    }

    // --- Initialization ---
    const container = d3.select("#vis-symbolmap");
    
    if (container.empty()) {
        console.error("Symbol Map Error: Container #vis-symbolmap not found.");
        return; 
    }
    
    container.selectAll("*").remove();
    
    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "auto");

    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "white");

    const projection = d3.geoMercator().center([138, 36]).scale(1500).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    let allVisitorData = [];
    let visitorIdCounter = 0;

    // --- Data Loading and Drawing ---
    d3.json(geoJsonUrl).then(function(japanData) {
        
        // Draw the base map outline
        svg.append("g").attr("class", "map-outline").selectAll("path")
          .data(japanData.features).enter().append("path")
          .attr("d", path)
          .attr("fill", "#e8e8e8")
          .attr("stroke", "#999")
          .attr("stroke-width", 0.5);

        const visitorCircleGroup = svg.append("g").attr("class", "visitor-circles");
        const visitorLabelGroup = svg.append("g").attr("class", "visitor-labels");
        
        // --- Simulation Loop ---
        setInterval(() => {
            
            const numNewVisitors = Math.floor(Math.random() * 2) + 1; 
            for (let i = 0; i < numNewVisitors; i++) {
                const randomCity = cityPool[Math.floor(Math.random() * cityPool.length)];
                visitorIdCounter++;
                allVisitorData.push({
                    id: `M2_${visitorIdCounter}`, 
                    coords: randomCity.coords,
                    location: randomCity.name,
                    timestamp: new Date().toLocaleTimeString()
                });
            }

            const locationCounts = aggregateData(allVisitorData);
            
            // Update Circles
            const circles = visitorCircleGroup.selectAll("circle")
                .data(locationCounts, d => d.location);

            circles.enter()
                .append("circle")
                .attr("class", "symbolmap-dot symbolmap-arriving") 
                .attr("cx", d => projection(d.coords)[0])
                .attr("cy", d => projection(d.coords)[1])
                .attr("fill", "#d9534f") 
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .style("opacity", 0.5)
                .each(function(d) {
                    // Set CSS variable for animation reference (used in CSS for final size)
                    d3.select(this).style("--initial-r", d.radius + "px").attr("r", MIN_R);
                })
                .transition()
                    .duration(800)
                    .ease(d3.easeQuadOut)
                    .attr("r", d => d.radius)
                    .style("opacity", 0.9);

            // Transition existing circles to new sizes/positions
            circles.transition()
                .duration(800)
                .ease(d3.easeQuadOut)
                .attr("r", d => d.radius)
                .attr("cx", d => projection(d.coords)[0])
                .attr("cy", d => projection(d.coords)[1])
                .style("opacity", 0.9);
            
            circles.exit().remove();

            // Update Labels (We keep all labels for context, even if they aren't strictly necessary for this map type)
            const labels = visitorLabelGroup.selectAll("text")
                .data(allVisitorData, d => d.id);

            labels.enter()
                .append("text")
                .attr("x", d => projection(d.coords)[0] + 15)
                .attr("y", d => projection(d.coords)[1] + (Math.random() * 10 - 5))
                .text(d => `${d.location}`)
                .attr("font-size", 9)
                .attr("fill", "#333")
                .style("opacity", 0)
                .transition().duration(500).style("opacity", 0.7);

            labels.text(d => `${d.location}`)
                  .attr("x", d => projection(d.coords)[0] + 15)
                  .attr("y", d => projection(d.coords)[1] + (Math.random() * 10 - 5))
                  .transition().duration(800).style("opacity", 0.7);
            
            labels.exit().remove();

        }, 3000); // Update every 3 seconds
        
    }).catch(err => console.error("Symbol Map Data Load Error:", err));

})();