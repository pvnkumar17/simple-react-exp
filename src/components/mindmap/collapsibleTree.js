import React, { useRef, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { editorInfoUpdate, mindMapUpdate } from '../../actions/meAction';
import * as d3 from "d3";
import { fetchMemorymapData } from "../../services/meService";
import { convertToNestedJson, convertToNestedJsonMindMap, convertToNestedJsonPrivate } from "../../utils/convertToNestedJson";
import { cloneDeep } from 'lodash';

const CollapsibleTree = ({ data, sendEditorData, setMindMapData, initialTreeData }) => {
  const svgRef = useRef(null);

  const [treeData, setTreeData] = useState([]);

  const findPath = (treeNode, key, path = []) => {
    
    if (treeNode?._id === key) {
      return [...path, {title: treeNode.title, slug: treeNode.slug}];
    }

    if (treeNode?.children) {
      for (let child of treeNode.children) {
        const foundPath = findPath(child, key, [...path, {title: treeNode.title, slug: treeNode.slug}]);
        if (foundPath) {
          return foundPath;
        }
      }
    }

    return null;
  };

  const handleMindmapLinkClick = (mindmapNode) => {
    window.location.hash = mindmapNode.slug || '';
    const path = findPath({ children: treeData }, mindmapNode._id);
    mindmapNode.path = path;
    sendEditorData(mindmapNode);
    fetchMemorymapData(mindmapNode._id).then(res => {
      const nestedMindMapData = convertToNestedJsonMindMap(res.data);
      setMindMapData(nestedMindMapData);
    }
  );
  }

  useEffect(() => {
    if (initialTreeData?.data) {
      const copyTreeData = cloneDeep(initialTreeData.data);
      const hierarchy = [...convertToNestedJsonPrivate(copyTreeData), ...convertToNestedJson(copyTreeData)];
      setTreeData(hierarchy);
     //FlatenTreeData([...copyTreeData.privateNodes, ...copyTreeData.publicNodes]);
    }
  }, [initialTreeData])

  useEffect(() => {
    // Specify the charts’ dimensions. The height is variable, depending on the layout.
  const width = 928;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 50;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  const root = d3.hierarchy(data);
  const dx = 40;
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
      .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif; user-select: none;");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  const getT = (d) => {
    // if(d.data.type === "file"){
    //   const textDetails = d.data.dataDetails.text &&  JSON.parse(d.data.dataDetails.text)?.root?.children?.filter(item => item.type === 'heading') || [];
    //   const titleText = textDetails.length && textDetails.map(item => `<div><a>${item.children[0].text}</a></div>`);
    //   //return `<div><div>${d.data.title}</div> <span>${titleText?.toString()}</span></div>`;
    //   return `<div>${d.data.title}</div>`;
    // }else {
      return `<div>${d.data.title}</div>`
    //}
  }

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
        .attr("r", 5.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    // nodeEnter.append("text")
    // //nodeEnter.append("foreignObject")
    //     .attr("dy", "0.31em")
    //     .attr("x", d => d._children ? -6 : 6)
    //     .attr("text-anchor", d => d._children ? "end" : "start")
    //     //.text(d => d.data.title)
    //     .text(d => getT(d))
    //     //.html(d => getT(d))
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-width", 3)
    //     .attr("stroke", "white")
    //     .attr("paint-order", "stroke");

    nodeEnter.append("foreignObject")
    .attr("width", 120) // Adjust width as needed
    .attr("height", 40) // Adjust height as needed
    .append("xhtml:div")
    .style("font", "14px sans-serif")
    .style("color", d => (d._children ? "#555" : "#999"))
    .html(d => getT(d))
    .on("click", function(d) {
      // Handle the click event
      if(d.currentTarget.__data__.data.type === "fileText"){
        handleMindmapLinkClick(d.currentTarget.__data__.parent.data);
      }
  });;

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
function mapStateToProps(state, ownProps) {
  return {
    initialTreeData: state.meDetails.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendEditorData: (data) => dispatch(editorInfoUpdate(data)),
    setMindMapData: (data) => dispatch(mindMapUpdate(data))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CollapsibleTree);
