document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("d3-tipologia");
    if (!container) return;

    const width = container.clientWidth;
    const height = 500;

    const data = {
        name: "Tensão Situada",
        children: [
            {
                name: "Tensões de Contradição",
                color: "#E63946",
                children: [
                    { name: "Disjunção", value: 100 },
                    { name: "Paradoxo", value: 100 },
                    { name: "Fratura de Agenciamento", value: 100 }
                ]
            },
            {
                name: "Tensões de Movimento",
                color: "#457b9d",
                children: [
                    { name: "Compressão", value: 100 },
                    { name: "Estagnação", value: 100 },
                    { name: "Turbulência", value: 100 }
                ]
            },
            {
                name: "Tensões de Adjacência",
                color: "#2a9d8f",
                children: [
                    { name: "Atração", value: 100 },
                    { name: "Capacidade Latente", value: 100 },
                    { name: "Emergência Travada", value: 100 }
                ]
            }
        ]
    };

    const svg = d3.select("#d3-tipologia")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    // Create a hierarchy and a pack layout
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const pack = d3.pack()
        .size([width, height])
        .padding(15);

    const nodes = pack(root).descendants();

    const node = svg.selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => d.depth === 0 ? "rgba(0,0,0,0.02)" : (d.depth === 1 ? d.data.color : "var(--surface-color)"))
        .attr("stroke", d => d.depth === 1 ? "none" : (d.depth === 2 ? d.parent.data.color : "none"))
        .attr("stroke-width", 2)
        .attr("opacity", d => d.depth === 0 ? 0 : 0.8)
        .style("transition", "all 0.3s ease")
        .on("mouseover", function(event, d) {
            if (d.depth > 0) d3.select(this).attr("opacity", 1).attr("r", d.r * 1.05);
        })
        .on("mouseout", function(event, d) {
            if (d.depth > 0) d3.select(this).attr("opacity", 0.8).attr("r", d.r);
        });

    node.filter(d => d.depth > 0).append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .attr("text-anchor", "middle")
        .attr("fill", d => "var(--text-color)")
        .style("font-family", "var(--font-sans)")
        .style("font-size", d => d.depth === 1 ? "14px" : "12px")
        .style("font-weight", d => d.depth === 1 ? "800" : "600")
        .style("pointer-events", "none")
        .text(d => d);

    // Responsive resize
    window.addEventListener("resize", () => {
        const newWidth = container.clientWidth;
        svg.attr("viewBox", [0, 0, newWidth, height]);
        pack.size([newWidth, height]);
        
        const newNodes = pack(root).descendants();
        node.data(newNodes)
            .transition()
            .duration(500)
            .attr("transform", d => `translate(${d.x},${d.y})`);
        
        node.selectAll("circle").transition().duration(500).attr("r", d => d.r);
    });
});