// skills-radial-tree.js

function drawRadialTree() {
  // Sample hierarchical data structure for skills
  const treeData = {
    name: "Skills & Competencies",
    children: [
      {
        name: "Technical Skills",
        children: [
          {
            name: "Programming",
            children: [
              { name: "JavaScript", value: 18, year: 2023 },
              { name: "Python", value: 15, year: 2023 },
              { name: "Java", value: 8, year: 2023 },
              { name: "R", value: 6, year: 2023 }
            ]
          },
          {
            name: "Web Development",
            children: [
              { name: "React", value: 12, year: 2023 },
              { name: "Node.js", value: 10, year: 2023 },
              { name: "HTML/CSS", value: 16, year: 2023 },
              { name: "D3.js", value: 14, year: 2023 }
            ]
          },
          {
            name: "Data Science",
            children: [
              { name: "Machine Learning", value: 9, year: 2023 },
              { name: "Data Visualization", value: 12, year: 2023 },
              { name: "Statistical Analysis", value: 11, year: 2023 },
              { name: "Big Data", value: 7, year: 2023 }
            ]
          }
        ]
      },
      {
        name: "Professional Skills",
        children: [
          {
            name: "Communication",
            children: [
              { name: "Technical Writing", value: 13, year: 2023 },
              { name: "Presentation", value: 15, year: 2023 },
              { name: "Documentation", value: 11, year: 2023 }
            ]
          },
          {
            name: "Project Management",
            children: [
              { name: "Agile/Scrum", value: 10, year: 2023 },
              { name: "Team Leadership", value: 8, year: 2023 },
              { name: "Risk Management", value: 6, year: 2023 }
            ]
          },
          {
            name: "Problem Solving",
            children: [
              { name: "Analytical Thinking", value: 16, year: 2023 },
              { name: "Debugging", value: 14, year: 2023 },
              { name: "Optimization", value: 9, year: 2023 }
            ]
          }
        ]
      }
    ]
  };

  // Configuration
  const config = {
    width: 1000,
    height: 1000,
    margin: 120,
    maxRadius: null,
    duration: 750,
    dotSizeRange: [4, 25]
  };

  // Calculate max radius
  config.maxRadius = Math.min(config.width, config.height) / 2 - config.margin;

  // Clear previous content
  d3.select('#vis-radarplot').html('');

  // Create SVG
  const svg = d3.select('#vis-radarplot')
    .append('svg')
    .attr('width', config.width)
    .attr('height', config.height)
    .append('g')
    .attr('transform', `translate(${config.width / 2}, ${config.height / 2})`);

  // Create tree layout
  const tree = d3.tree()
    .size([2 * Math.PI, config.maxRadius])
    .separation((a, b) => {
      if (a.depth === 1 && b.depth === 1) return 2;
      if (a.depth === 2 && b.depth === 2) return 1.5;
      return (a.parent === b.parent ? 1 : 2) / a.depth;
    });

  // Convert hierarchical data
  const root = d3.hierarchy(treeData);
  root.descendants().forEach((d, i) => {
    d.id = i;
    if (d.data.value === undefined && !d.children) {
      d.data.value = 5;
    }
  });

  // Create tree structure
  tree(root);

  // Create scales
  const dotSizeScale = d3.scaleSqrt()
    .domain([0, d3.max(root.descendants().filter(d => !d.children), d => d.data.value || 0)])
    .range(config.dotSizeRange);

  const colorScale = d3.scaleOrdinal()
    .domain(["Technical Skills", "Professional Skills"])
    .range(["#4e79a7", "#f28e2c"]);

  const depthColorScale = d3.scaleLinear()
    .domain([1, 3])
    .range(["#ffffff", "#333333"]);

  // Draw links (edges)
  const links = svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y)
    )
    .style('fill', 'none')
    .style('stroke', '#ccc')
    .style('stroke-width', '1.5px')
    .style('stroke-opacity', 0.6);

  // Create node groups
  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', d => `node ${d.children ? ' node--internal' : ' node--leaf'}`)
    .attr('transform', d => `translate(${radialToCartesian(d.y, d.x)})`);

  // Draw circles for leaf nodes
  node.filter(d => !d.children)
    .append('circle')
    .attr('r', d => dotSizeScale(d.data.value || 0))
    .style('fill', d => {
      if (d.depth === 1) return colorScale(d.data.name);
      if (d.depth === 2) return d3.color(colorScale(d.parent.data.name)).brighter(0.5);
      return d3.color(colorScale(d.parent.parent.data.name)).brighter(0.8);
    })
    .style('stroke', d => depthColorScale(d.depth))
    .style('stroke-width', '1.5px')
    .style('fill-opacity', 0.8)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      const ancestors = d.ancestors();
      svg.selectAll('.node circle')
        .style('opacity', 0.3);
      svg.selectAll('.link')
        .style('opacity', 0.2);
      
      ancestors.forEach(ancestor => {
        d3.selectAll(`.node-${ancestor.id} circle`)
          .style('opacity', 1);
      });
      
      d3.select(this)
        .style('opacity', 1)
        .style('stroke-width', '3px');

      tooltip
        .style('opacity', 1)
        .html(`
          <strong>${d.data.name}</strong><br/>
          Projects: ${d.data.value || 'N/A'}<br/>
          Level: ${getSkillLevel(d.data.value)}<br/>
          Category: ${getCategoryPath(d)}
        `);
    })
    .on('mouseout', function(event, d) {
      svg.selectAll('.node circle')
        .style('opacity', 0.8);
      svg.selectAll('.link')
        .style('opacity', 0.6);
      
      d3.select(this)
        .style('stroke-width', '1.5px');

      tooltip.style('opacity', 0);
    })
    .each(function(d) {
      d3.select(this).classed(`node-${d.id}`, true);
    });

  // Draw circles for internal nodes
  node.filter(d => d.children)
    .append('circle')
    .attr('r', d => d.depth === 0 ? 9 : 4)
    .style('fill', d => {
      if (d.depth === 0) return '#333';
      if (d.depth === 1) return colorScale(d.data.name);
      return d3.color(colorScale(d.parent.data.name)).brighter(0.5);
    })
    .style('stroke', d => d.depth === 0 ? '#333' : depthColorScale(d.depth))
    .style('stroke-width', d => d.depth === 0 ? '2px' : '2px')
    .style('cursor', 'pointer')
    .style('opacity', 0.8)
    .on('click', function(event, d) {
      toggleChildren(d);
    });

  // Add labels - UPDATED ROOT NODE TEXT STYLING WITH dy="25"
  node.append('text')
    .attr('dy', d => {
      if (d.children) {
        // Root node gets dy="25", other internal nodes get dy="-12"
        return d.depth === 0 ? 25 : -12;
      } else {
        const angle = d.x * 180 / Math.PI;
        if (angle >= 45 && angle <= 135) return 20;
        if (angle > 135 && angle < 225) return -12;
        if (angle >= 225 && angle <= 315) return -12;
        return 20;
      }
    })
    .attr('dx', d => {
      if (!d.children) {
        const angle = d.x * 180 / Math.PI;
        return (angle < 90 || angle > 270) ? 8 : -8;
      }
      // Root node gets dx="70", other nodes get appropriate dx
      return d.depth === 0 ? 70 : 0;
    })
    .attr('text-anchor', d => {
      if (d.depth === 0) return 'end'; // Root node gets text-anchor="end"
      const angle = d.x * 180 / Math.PI;
      return angle < 90 || angle > 270 ? 'start' : 'end';
    })
    .attr('transform', d => {
      const angle = d.x * 180 / Math.PI;
      const rotation = angle < 90 || angle > 270 ? angle : angle + 180;
      return d.children ? '' : `rotate(${rotation})`;
    })
    .style('font-size', d => {
      if (d.depth === 0) return '16px'; // Root node gets font-size 16px
      if (d.depth === 1) return '13px';
      if (d.depth === 2) return '11px';
      return '9px';
    })
    .style('font-weight', d => d.depth <= 1 ? 'bold' : 'normal')
    .style('fill', d => d.depth === 0 ? '#333' : '#666')
    .style('pointer-events', 'none')
    .style('user-select', 'none')
    .text(d => {
      if (d.depth === 0) return d.data.name; // Root node shows "Skills & Competencies"
      if (d.depth <= 2) return d.data.name;
      return `${d.data.name} (${d.data.value})`;
    })
    .clone(true).lower()
    .style('stroke', 'white')
    .style('stroke-width', '3px')
    .style('stroke-linejoin', 'round')
    .style('paint-order', 'stroke');

  // Add title and subtitle in center
  const centerGroup = svg.append('g')
    .attr('text-anchor', 'middle');

  centerGroup.append('text')
    .attr('dy', '-2em')
    .style('font-size', '40px')
    .style('font-weight', 'bold')
    .style('fill', '#333')
    .text('Skills Radial Tree');

  centerGroup.append('text')
    .attr('dy', '-0.7em')
    .style('font-size', '14px')
    .style('fill', '#666')
    .style('font-style', 'italic')
    .text('Interactive Visualization');

  // Create tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'radial-tree-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(255, 255, 255, 0.95)')
    .style('padding', '8px 12px')
    .style('border', '1px solid #ccc')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('font-size', '12px')
    .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
    .style('z-index', '1000');

  // Helper functions
  function radialToCartesian(radius, angle) {
    return [
      radius * Math.sin(angle),
      -radius * Math.cos(angle)
    ];
  }

  function getSkillLevel(value) {
    if (value >= 15) return 'Expert';
    if (value >= 10) return 'Advanced';
    if (value >= 5) return 'Intermediate';
    return 'Beginner';
  }

  function getCategoryPath(node) {
    const path = [];
    let current = node;
    while (current && current.data.name !== "Skills & Competencies") {
      path.unshift(current.data.name);
      current = current.parent;
    }
    return path.slice(0, -1).join(' → ');
  }

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update();
  }

  function update() {
    tree(root);
    
    const updatedNodes = svg.selectAll('.node')
      .data(root.descendants());
    
    updatedNodes.attr('transform', d => `translate(${radialToCartesian(d.y, d.x)})`);
    
    const updatedLinks = svg.selectAll('.link')
      .data(root.links());
    
    updatedLinks.attr('d', d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y)
    );
  }

  // Add legend
  const legend = svg.append('g')
    .attr('transform', `translate(${-config.width / 2 + 20}, ${config.height / 2 - 180})`);

  // Color legend
  const colorLegend = legend.append('g');
  
  colorLegend.append('text')
    .attr('y', -10)
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', '#333')
    .text('Skill Categories');

  ['Technical Skills', 'Professional Skills'].forEach((category, i) => {
    const g = colorLegend.append('g')
      .attr('transform', `translate(0, ${i * 25 + 10})`);
    
    g.append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .style('fill', colorScale(category))
      .style('stroke', '#333')
      .style('stroke-width', '1px');
    
    g.append('text')
      .attr('x', 22)
      .attr('y', 7)
      .attr('dy', '0.35em')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text(category);
  });

  // Size legend - positioned at translate(700, 100)
  const sizeLegend = svg.append('g')
    .attr('transform', 'translate(700, 100)');

  sizeLegend.append('text')
    .attr('y', -10)
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', '#333')
    .text('Project Count');

  const maxValue = d3.max(root.descendants().filter(d => !d.children), d => d.data.value || 0);
  const sizeSamples = [Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue];
  
  sizeSamples.forEach((size, i) => {
    const g = sizeLegend.append('g')
      .attr('transform', `translate(0, ${i * 30 + 10})`);
    
    const circleSize = dotSizeScale(size);
    
    g.append('circle')
      .attr('r', circleSize)
      .style('fill', '#666')
      .style('fill-opacity', 0.8)
      .style('stroke', '#333')
      .style('stroke-width', '1.5px');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '9px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .text(size);
    
    g.append('text')
      .attr('x', circleSize + 20)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(`projects`);
  });

  // Add concentric circles
  const levels = [config.maxRadius * 0.33, config.maxRadius * 0.66, config.maxRadius];
  svg.selectAll('.level')
    .data(levels)
    .enter()
    .append('circle')
    .attr('class', 'level')
    .attr('r', d => d)
    .style('fill', 'none')
    .style('stroke', '#eee')
    .style('stroke-width', '1px')
    .style('stroke-dasharray', '2,2');
}

// Initialize when DOM is ready
if (typeof d3 !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawRadialTree);
  } else {
    drawRadialTree();
  }
} else {
  console.error('D3.js is not loaded. Please include D3.js before this script.');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { drawRadialTree };
}