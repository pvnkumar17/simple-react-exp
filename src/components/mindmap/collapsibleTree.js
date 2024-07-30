import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const CollapsibleTree = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // const width = 960;
    // const height = 600;

    // const svg = d3.select(svgRef.current)
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("viewBox", [-width / 2, -height / 2, width, height])
    //   .style("font", "10px sans-serif")
    //   .style("user-select", "none");

    // const root = d3.hierarchy(data);
    // root.dx = 10;
    // root.dy = width / 6;
    // root.x0 = 0;
    // root.y0 = 0;
    // root.descendants().forEach((d, i) => {
    //   d.id = i;
    //   d._children = d.children;
    //   if (d.depth && d.data.title.length !== 7) d.children = null;
    // });

    // const tree = d3.tree().nodeSize([root.dx, root.dy]);

    // const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

    // const g = svg.append("g")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 10)
    //   .attr("transform", `translate(${root.dy / 3},${root.dx - 100})`);

    // const update = (source) => {
    //   const nodes = root.descendants().reverse();
    //   const links = root.links();

    //   tree(root);

    //   let left = root;
    //   let right = root;
    //   root.eachBefore(node => {
    //     if (node.x < left.x) left = node;
    //     if (node.x > right.x) right = node;
    //   });

    //   const height = right.x - left.x + root.dx * 2;

    //   const transition = svg.transition()
    //     .duration(250)
    //     .attr("viewBox", [-root.dy / 3, left.x - root.dx, width, height])
    //     .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    //   const node = g.selectAll("g")
    //     .data(nodes, d => d.id);

    //   const nodeEnter = node.enter().append("g")
    //     .attr("transform", d => `translate(${source.y0},${source.x0})`)
    //     .attr("fill-opacity", 0)
    //     .attr("stroke-opacity", 0)
    //     .on("click", (event, d) => {
    //       d.children = d.children ? null : d._children;
    //       update(d);
    //     });

    //   nodeEnter.append("circle")
    //     .attr("r", 2.5)
    //     .attr("fill", d => d._children ? "#555" : "#999")
    //     .attr("stroke-width", 10);

    //   nodeEnter.append("text")
    //     .attr("dy", "0.31em")
    //     .attr("x", d => d._children ? -6 : 6)
    //     .attr("text-anchor", d => d._children ? "end" : "start")
    //     .text(d => d.data.title)
    //     .clone(true).lower()
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-width", 3)
    //     .attr("stroke", "white");

    //   node.merge(nodeEnter).transition(transition)
    //     .attr("transform", d => `translate(${d.y},${d.x})`)
    //     .attr("fill-opacity", 1)
    //     .attr("stroke-opacity", 1);

    //   node.exit().transition(transition).remove()
    //     .attr("transform", d => `translate(${source.y},${source.x})`)
    //     .attr("fill-opacity", 0)
    //     .attr("stroke-opacity", 0);

    //   const link = g.selectAll("path")
    //     .data(links, d => d.target.id);

    //   const linkEnter = link.enter().append("path")
    //     .attr("d", d => {
    //       const o = { x: source.x0, y: source.y0 };
    //       return diagonal({ source: o, target: o });
    //     });

    //   link.merge(linkEnter).transition(transition)
    //     .attr("d", diagonal);

    //   link.exit().transition(transition).remove()
    //     .attr("d", d => {
    //       const o = { x: source.x, y: source.y };
    //       return diagonal({ source: o, target: o });
    //     });

    //   root.eachBefore(d => {
    //     d.x0 = d.x;
    //     d.y0 = d.y;
    //   });
    // };

    // update(root);
    // Specify the charts’ dimensions. The height is variable, depending on the layout.
  const width = 928;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 40;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  const root = d3.hierarchy(data);
  const dx = 10;
  const dy = (width - marginRight - marginLeft) / (1 + root.height);

  // Define the tree layout and the shape for links.
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  // Create the SVG container, a layer for the links and a layer for the nodes.
  const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
      svg.attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(event, source) {
    const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + marginTop + marginBottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.title)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        .attr("paint-order", "stroke");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Do the first update to the initial configuration of the tree — where a number of nodes
  // are open (arbitrarily selected as the root, plus nodes with 7 letters).
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.title.length !== 7) d.children = null;
  });
  update(null, root);
  }, [data, svgRef.current]);

  return <svg ref={svgRef}></svg>;
};

export default CollapsibleTree;
