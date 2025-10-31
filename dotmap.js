// --- dotmap.js ---

// Ensure this script runs AFTER D3.js is loaded in your HTML.
(function() {
    // --- Configuration (Must match what is needed for the visualization) ---
    const width = 1200;
    const height = 1400;
    // NOTE: This URL MUST be accessible (no strict CORS blocking)
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

    // --- Initialization ---
    const container = d3.select("#vis-dotmap");
    
    if (container.empty()) {
        console.error("Dot Map Error: Container #vis-dotmap not found.");
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
          .attr("fill", "#f0f0f0")
          .attr("stroke", "#999")
          .attr("stroke-width", 0.5);

        const visitorGroup = svg.append("g").attr("class", "visitors-dotmap");
        
        // --- Simulation Loop ---
        setInterval(() => {
            const numNewVisitors = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < numNewVisitors; i++) {
                const randomCity = cityPool[Math.floor(Math.random() * cityPool.length)];
                visitorIdCounter++;
                allVisitorData.push({
                    id: visitorIdCounter,
                    coords: randomCity.coords,
                    location: randomCity.name,
                    timestamp: new Date().toLocaleTimeString()
                });
            }

            // D3 Update Pattern for Circles
            const circles = visitorGroup.selectAll("circle")
                .data(allVisitorData, d => d.id);

            circles.enter()
                .append("circle")
                .attr("class", "dotmap-dot dotmap-pulse")
                .attr("cx", d => projection(d.coords)[0])
                .attr("cy", d => projection(d.coords)[1])
                .attr("r", 5) 
                .attr("fill", "#007bff") 
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .style("opacity", 0)
                .transition()
                    .duration(500)
                    .style("opacity", 1)
                    .on("end", function() {
                        // Stop pulsing after initial drawing
                        d3.select(this).classed("dotmap-pulse", false).attr("r", 5);
                    });

            // Update positions for existing elements
            circles.attr("cx", d => projection(d.coords)[0])
                   .attr("cy", d => projection(d.coords)[1]);
            circles.exit().remove();

            // D3 Update Pattern for Labels (Simplified)
            const labels = visitorGroup.selectAll("text")
                .data(allVisitorData, d => d.id);

            labels.enter()
                .append("text")
                .attr("x", d => projection(d.coords)[0] + 10)
                .attr("y", d => projection(d.coords)[1] - 5)
                .text(d => `${d.location}`)
                .attr("font-size", 10)
                .attr("fill", "#333")
                .style("opacity", 0)
                .transition().duration(500).style("opacity", 1);
            
            labels.text(d => `${d.location}`)
                  .attr("x", d => projection(d.coords)[0] + 10)
                  .attr("y", d => projection(d.coords)[1] - 5);
            
            labels.exit().remove();

        }, 3000); // Update every 3 seconds
        
    }).catch(err => console.error("Dot Map Data Load Error:", err));

})();