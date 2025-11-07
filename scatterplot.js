(function () {
    // --- 1. DATA ---
    const originalData = [
        { id: 1, year: 2020, type: "Painting", medium: "Physical", count: 5 },
        { id: 2, year: 2021, type: "Painting", medium: "Physical", count: 8 },
        { id: 3, year: 2022, type: "Painting", medium: "Digital", count: 12 },
        { id: 4, year: 2023, type: "Painting", medium: "Digital", count: 7 },
        { id: 5, year: 2020, type: "Music", medium: "Digital", count: 3 },
        { id: 6, year: 2021, type: "Music", medium: "Digital", count: 10 },
        { id: 7, year: 2022, type: "Music", medium: "Digital", count: 15 },
        { id: 8, year: 2023, type: "Music", medium: "Physical", count: 9 },
        { id: 9, year: 2020, type: "Video", medium: "Digital", count: 2 },
        { id: 10, year: 2021, type: "Video", medium: "Digital", count: 4 },
        { id: 11, year: 2022, type: "Video", medium: "Digital", count: 6 },
        { id: 12, year: 2023, type: "Video", medium: "Digital", count: 8 },
        { id: 13, year: 2020, type: "Sculpture", medium: "Physical", count: 1 },
        { id: 14, year: 2021, type: "Sculpture", medium: "Physical", count: 2 },
        { id: 15, year: 2022, type: "Sculpture", medium: "Physical", count: 3 },
        { id: 16, year: 2023, type: "Sculpture", medium: "Physical", count: 4 },
        { id: 17, year: 2022, type: "Writing", medium: "Digital", count: 18 },
        { id: 18, year: 2023, type: "Writing", medium: "Digital", count: 22 },
        { id: 19, year: 2024, type: "Painting", medium: "Digital", count: 15 },
        { id: 20, year: 2024, type: "Music", medium: "Physical", count: 12 },
        { id: 21, year: 2024, type: "Video", medium: "Digital", count: 9 },
        { id: 22, year: 2024, type: "Sculpture", medium: "Digital", count: 5 },
        { id: 23, year: 2024, type: "Writing", medium: "Physical", count: 20 },
        { id: 24, year: 2024, type: "Photography", medium: "Digital", count: 11 },
        { id: 25, year: 2025, type: "Music", medium: "Digital", count: 14 },
        { id: 26, year: 2025, type: "Painting", medium: "Physical", count: 18 },
        { id: 27, year: 2025, type: "Sculpture", medium: "Digital", count: 7 },
        { id: 28, year: 2025, type: "Video", medium: "Physical", count: 10 },
        { id: 29, year: 2025, type: "Writing", medium: "Digital", count: 25 },
        { id: 30, year: 2025, type: "Photography", medium: "Digital", count: 13 },
        { id: 31, year: 2026, type: "Animation", medium: "Digital", count: 10 },
        { id: 32, year: 2026, type: "Painting", medium: "Digital", count: 20 },
        { id: 33, year: 2026, type: "Music", medium: "Digital", count: 16 },
        { id: 34, year: 2026, type: "Sculpture", medium: "Physical", count: 8 },
        { id: 35, year: 2026, type: "Video", medium: "Digital", count: 12 }
    ];

    const quantitativeFields = ['year', 'count'];
    const categoricalFields = ['type', 'medium'];
    const allFields = [...quantitativeFields, ...categoricalFields];

    // Global state for zoom/pan tracking
    let currentTransform = d3.zoomIdentity;

    // --- 2. SETUP UI CONTROLS ---
    const encodingDropdowns = ['x-encoding', 'y-encoding', 'size-encoding', 'color-encoding'];
    encodingDropdowns.forEach(id => {
        const select = d3.select(`#${id}`);
        select.selectAll("option")
            .data(allFields)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d.charAt(0).toUpperCase() + d.slice(1));
    });

    d3.select("#x-encoding").property("value", "year");
    d3.select("#y-encoding").property("value", "type");
    d3.select("#size-encoding").property("value", "count");
    d3.select("#color-encoding").property("value", "medium");
    d3.select("#y-sort").property("value", "count-desc");

    const types = [...new Set(originalData.map(d => d.type))].sort();
    const typeFilterContainer = d3.select("#type-filter");
    typeFilterContainer.selectAll("label")
        .data(types)
        .enter()
        .append("label")
        .html(d => `<input type="checkbox" class="type-checkbox" value="${d}" checked> ${d}`);

    const yearExtent = d3.extent(originalData, d => d.year);
    const yearSlider = d3.select("#year-slider")
        .attr("min", yearExtent[0])
        .attr("max", yearExtent[1])
        .attr("value", yearExtent[1])
        .attr("step", 1);

    function updateYearLabel(year) {
        d3.select("#year-range-label").text(`Up to year ${year}`);
    }
    updateYearLabel(yearSlider.property("value"));

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // --- 3. D3 SVG SETUP ---
    const margin = { top: 60, right: 120, bottom: 70, left: 100 };
    let width, height;

    const svgContainer = d3.select("#chart-container")
        .append("div")
        .style("position", "relative");

    const svg = svgContainer.append("svg")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxisGroup = svg.append("g").attr("class", "x-axis");
    const yAxisGroup = svg.append("g").attr("class", "y-axis");

    const xAxisLabel = svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle");

    const yAxisLabel = svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

    const chartTitle = svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle");

    const legendContainer = d3.select("#legend-container");

    // --- ZOOM SETUP ---
    function handleZoom(event) {
        // Store the new transform state
        currentTransform = event.transform;
        // Trigger a full update to redraw scales, axes, and geometry based on the new transform
        update();
    }

    // Define the zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 20]) // Allow zooming between 0.5x and 20x
        .on("zoom", handleZoom);

    // Apply zoom behavior to the main drawing group (svg)
    svg.call(zoom);

    // --- 4. THE UPDATE FUNCTION ---
    function update() {
        // --- A. GET CONTROL VALUES ---
        const xEncoding = d3.select("#x-encoding").property("value");
        const yEncoding = d3.select("#y-encoding").property("value");
        const sizeEncoding = d3.select("#size-encoding").property("value");
        const colorEncoding = d3.select("#color-encoding").property("value");
        const ySort = d3.select("#y-sort").property("value");
        const doAggregate = d3.select("#aggregate-data").property("checked");

        const selectedYear = +yearSlider.property("value");
        updateYearLabel(selectedYear);

        const selectedTypes = new Set();
        d3.selectAll(".type-checkbox").each(function() {
            if (this.checked) {
                selectedTypes.add(this.value);
            }
        });

        // Manage Y-Sort dropdown state: Disable if Y is quantitative
        const ySortSelect = d3.select("#y-sort");
        if (quantitativeFields.includes(yEncoding)) {
            ySortSelect.property("disabled", true).property("value", "none");
        } else {
            ySortSelect.property("disabled", false);
            // If disabled state was previously active, reset sort to default when re-enabled
            if (ySortSelect.property("value") === "none") {
                 ySortSelect.property("value", "alphabetic-asc");
            }
        }

        // --- B. RESPONSIVE DIMENSIONS ---
        const containerWidth = d3.select("#chart-container").node().getBoundingClientRect().width - 20; // Account for padding
        width = containerWidth - margin.left - margin.right;
        height = Math.max(300, (containerWidth * 0.6) - margin.top - margin.bottom);

        // Update SVG element dimensions
        d3.select("#chart-container svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Update the main group's transform based on the current zoom state
        svg.attr("transform", currentTransform);


        // --- C. FILTER & AGGREGATE DATA ---
        let dataFiltered = originalData.filter(d =>
            d.year <= selectedYear && selectedTypes.has(d.type)
        );

        let chartData;
        if (doAggregate && categoricalFields.includes(yEncoding)) {
            chartData = Array.from(
                d3.group(dataFiltered, d => d[yEncoding]),
                ([key, values]) => {
                    const totalCount = d3.sum(values, v => v.count);
                    const representative = {
                        [yEncoding]: key,
                        count: totalCount,
                        year: d3.mean(values, v => v.year),
                        id: `agg-${key}`
                    };

                    // Attempt to infer other categorical values for better tooltips/context
                    if (categoricalFields.includes('type') && yEncoding !== 'type') {
                        const typeCounts = d3.rollup(values, v => v.length, d => d.type);
                        representative.type = Array.from(typeCounts).sort((a,b) => b[1]-a[1])[0][0];
                    } else if (yEncoding === 'type') {
                        representative.type = key;
                    }
                    if (categoricalFields.includes('medium') && yEncoding !== 'medium') {
                        const mediumCounts = d3.rollup(values, v => v.length, d => d.medium);
                        representative.medium = Array.from(mediumCounts).sort((a,b) => b[1]-a[1])[0][0];
                    } else if (yEncoding === 'medium') {
                        representative.medium = key;
                    }
                    return representative;
                }
            );
        } else {
            chartData = dataFiltered;
        }

        // --- D. DEFINE SCALES (Incorporating Zoom Transform) ---
        let x, y;

        // X Scale
        if (quantitativeFields.includes(xEncoding)) {
            let domain = d3.extent(chartData, d => d[xEncoding]);
            // Ensure domain is valid, default to 2020-2026 if data is empty or only one point
            if (!domain[0] || !domain[1] || domain[0] === domain[1]) {
                 domain = [yearExtent[0], yearExtent[1]];
            }
            x = d3.scaleLinear()
                  .domain(domain).nice()
                  .range([0, width]);
            // Apply stored zoom transform to quantitative scales
            x = currentTransform.rescaleX(x);
        } else {
            x = d3.scalePoint()
                  .domain([...new Set(chartData.map(d => d[xEncoding]))].sort(d3.ascending))
                  .range([0, width])
                  .padding(0.5);
        }

        // Y Scale
        if (quantitativeFields.includes(yEncoding)) {
            let domain = d3.extent(chartData, d => d[yEncoding]);
            y = d3.scaleLinear().domain(domain.length > 1 ? domain : [0, 1]).nice().range([height, 0]);
            // Apply stored zoom transform to quantitative scales
            y = currentTransform.rescaleY(y);
        } else {
            yDomain = [...new Set(chartData.map(d => d[yEncoding]))];

            // Reordering logic for categorical Y-axis
            if (ySort === 'alphabetic-asc') {
                yDomain.sort(d3.ascending);
            } else if (ySort === 'alphabetic-desc') {
                yDomain.sort(d3.descending);
            } else if (ySort.startsWith('count')) {
                const totals = new Map(Array.from(d3.group(chartData, d => d[yEncoding]), ([key, values]) => [key, d3.sum(values, v => v.count)]));
                if (ySort === 'count-asc') {
                    yDomain.sort((a, b) => (totals.get(a) || 0) - (totals.get(b) || 0));
                } else if (ySort === 'count-desc') {
                    yDomain.sort((a, b) => (totals.get(b) || 0) - (totals.get(a) || 0));
                }
            }
            y = d3.scalePoint().domain(yDomain).range([height, 0]).padding(0.5);
        }

        // Size Scale (Radius remains independent of zoom/pan)
        const size = d3.scaleSqrt()
            .domain([0, d3.max(chartData, d => d[sizeEncoding]) || 1])
            .range([3, 25]);

        // Color Scale
        const colorDomain = [...new Set(chartData.map(d => d[colorEncoding]))].sort();
        const color = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(d3.schemeSet2);

        // --- E. DRAW AXES & LABELS ---
        const xAxis = d3.axisBottom(x);
        
        // *** MODIFICATION START ***
        if (xEncoding === 'year') {
            // Format years as integers (e.g., 2020, 2021) instead of SI notation (e.g., 2.0k)
            xAxis.tickFormat(d3.format("d")); 
        } else if (quantitativeFields.includes(xEncoding)) {
            // Fallback for other quantitative fields (like 'count')
            xAxis.tickFormat(d3.format(".2s")); 
        }
        // *** MODIFICATION END ***
        
        xAxisGroup
            .attr("transform", `translate(0,${height})`)
            .transition().duration(currentTransform.k === 1 ? 750 : 100)
            .call(xAxis);

        const yAxis = d3.axisLeft(y);
        yAxisGroup
            .transition().duration(currentTransform.k === 1 ? 750 : 100)
            .call(yAxis);

        xAxisLabel
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 20)
            .text(xEncoding.charAt(0).toUpperCase() + xEncoding.slice(1));

        yAxisLabel
            .attr("y", -margin.left + 20)
            .attr("x", -height / 2)
            .text(yEncoding.charAt(0).toUpperCase() + yEncoding.slice(1));

        chartTitle
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .text(`Creative Work Data: ${sizeEncoding.charAt(0).toUpperCase() + sizeEncoding.slice(1)} by ${xEncoding.charAt(0).toUpperCase() + xEncoding.slice(1)} and ${yEncoding.charAt(0).toUpperCase() + yEncoding.slice(1)} (Color: ${colorEncoding.charAt(0).toUpperCase() + colorEncoding.slice(1)})`);

        // --- F. DRAW CIRCLES (General Update Pattern) ---
        const t = svg.transition().duration(currentTransform.k === 1 ? 750 : 100);

        svg.selectAll("circle")
            .data(chartData, d => d.id)
            .join(
                enter => enter.append("circle")
                    .attr("cx", d => x(d[xEncoding]))
                    .attr("cy", d => y(d[yEncoding]))
                    .attr("r", 0)
                    .style("fill", d => color(d[colorEncoding]))
                    .style("stroke", d => d3.color(color(d[colorEncoding])).darker())
                    .style("opacity", 0)
                    .on("mouseover", function(event, d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(`
                            <b>${yEncoding.charAt(0).toUpperCase() + yEncoding.slice(1)}:</b> ${d[yEncoding]}<br/>
                            <b>${xEncoding.charAt(0).toUpperCase() + xEncoding.slice(1)}:</b> ${d[xEncoding]}<br/>
                            <b>${sizeEncoding.charAt(0).toUpperCase() + sizeEncoding.slice(1)}:</b> ${d[sizeEncoding]}<br/>
                            <b>${colorEncoding.charAt(0).toUpperCase() + colorEncoding.slice(1)}:</b> ${d[colorEncoding]}
                        `)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .call(enter => enter.transition(t)
                        .attr("r", d => size(d[sizeEncoding]))
                        .style("opacity", 1)),
                update => update
                    .call(update => update.transition(t)
                        .attr("cx", d => x(d[xEncoding]))
                        .attr("cy", d => y(d[yEncoding]))
                        .attr("r", d => size(d[sizeEncoding]))
                        .style("fill", d => color(d[colorEncoding]))
                        .style("stroke", d => d3.color(color(d[colorEncoding])).darker())
                        .style("opacity", 1)),
                exit => exit
                    .call(exit => exit.transition(t)
                        .attr("r", 0)
                        .style("opacity", 0)
                        .remove())
            );

        // --- G. DRAW LEGEND ---
        if (categoricalFields.includes(colorEncoding)) {
            legendContainer.style("display", "flex");
            const legendItems = legendContainer.selectAll(".legend-item")
                .data(color.domain(), d => d);

            legendItems.join(
                enter => enter.append("div")
                    .attr("class", "legend-item")
                    .call(enter => {
                        enter.append("div")
                            .attr("class", "legend-color-box")
                            .style("background-color", d => color(d));
                        enter.append("span")
                            .text(d => d);
                    }),
                update => update
                    .call(update => {
                        update.select(".legend-color-box")
                            .style("background-color", d => color(d));
                        update.select("span")
                            .text(d => d);
                    }),
                exit => exit.remove()
            );
        } else {
            legendContainer.style("display", "none");
        }
    }

    // --- 5. EVENT LISTENERS ---
    // Reset zoom if the axis definition changes, as categorical axes cannot be zoomed geometrically
    d3.select("#x-encoding").on("change", function() {
        currentTransform = d3.zoomIdentity;
        svg.call(zoom.transform, d3.zoomIdentity);
        update();
    });
    d3.select("#y-encoding").on("change", function() {
        currentTransform = d3.zoomIdentity;
        svg.call(zoom.transform, d3.zoomIdentity);
        update();
    });
    d3.select("#size-encoding").on("change", update);
    d3.select("#color-encoding").on("change", function() {
        currentTransform = d3.zoomIdentity;
        svg.call(zoom.transform, d3.zoomIdentity);
        update();
    });
    d3.select("#y-sort").on("change", update);
    d3.select("#aggregate-data").on("change", update);
    d3.select("#year-slider").on("input", update);

    typeFilterContainer.on("change", function(event) {
        if (d3.select(event.target).classed("type-checkbox")) {
            update();
        }
    });

    // Initial call
    update();

    // Handle window resize for responsiveness
    window.addEventListener('resize', update);

})();