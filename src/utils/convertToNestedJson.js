export function convertToNestedJson(data) {
    if (!data || !data.publicNodes || !Array.isArray(data.publicNodes)) {
        console.error("Invalid input data or missing 'publicNodes' array.");
        return null;
    }

    const idMap = new Map();

    // Create a map of ids to nodes for quick lookup
    data.publicNodes.forEach((node) => {
        idMap.set(node._id, node);
    });

    // Traverse the data and build the hierarchy
    data.publicNodes.forEach((node) => {
        if (node?.children && node.children.length > 0) {
            node.children = node.children.map((childId) => idMap.get(childId));
        }
    });

    // Filter out nodes with parentId (they are now part of the hierarchy)
    const hierarchy = data.publicNodes.filter((node) => !node.parentId);

    // Sort the nested nodes at each level
    function sortNestedNodes(nodes) {
        nodes.forEach((node) => {
            if (node?.children && node.children.length > 0) {
                node.children.sort((a, b) => a.sortOrder - b.sortOrder);
                sortNestedNodes(node.children);
            }
        });
    }

    sortNestedNodes(hierarchy);

    return hierarchy;
}

export function convertToNestedJsonPrivate(data) {
    if (!data || !data.privateNodes || !Array.isArray(data.privateNodes)) {
        console.error("Invalid input data or missing 'privateNodes' array.");
        return null;
    }

    const idMap = new Map();

    // Create a map of ids to nodes for quick lookup
    data.privateNodes.forEach((node) => {
        idMap.set(node._id, node);
    });

    // Traverse the data and build the hierarchy
    data.privateNodes.forEach((node) => {
        if (node?.children && node.children.length > 0) {
            node.children = node.children.map((childId) => idMap.get(childId));
        }
    });

    // Filter out nodes with parentId (they are now part of the hierarchy)
    const hierarchy = data.privateNodes.filter((node) => !node.parentId);

    // Sort the nested nodes at each level
    function sortNestedNodes(nodes) {
        nodes.forEach((node) => {
            if (node?.children && node.children.length > 0) {
                node.children.sort((a, b) => a.sortOrder - b.sortOrder);
                sortNestedNodes(node.children);
            }
        });
    }

    sortNestedNodes(hierarchy);
    return hierarchy;
}

export function convertToNestedJsonMindMap(data) {
    if (!data || !data.flatNodes || !Array.isArray(data.flatNodes)) {
      console.error("Invalid input data or missing 'flatNodes' array.");
      return null;
    }
  
    const idMap = new Map();
  
    // Create a map of ids to nodes for quick lookup
    data.flatNodes.forEach((node) => {
      idMap.set(node._id, { ...node, children: [] });
    });
    data.flatNodes.forEach((node) => {
      if(node.type === "file" && node.dataDetails?.text){
        const textDetails = JSON.parse(node.dataDetails.text)?.root?.children?.filter(item => item.type === 'heading') || [];
        const titleText = textDetails.length && textDetails.map((item, index) => {return {_id: index, type: 'fileText', title: item.children[0].text}});
        if(titleText.length){
          const textData = idMap.get(node._id);
          textData.children = titleText;
        }

      }
    });
    // Traverse the data and build the hierarchy
    data.flatNodes.forEach((node) => {
      if (node.parentId) {
        const parentNode = idMap.get(node.parentId);
        if (parentNode) {
          parentNode.children.push(idMap.get(node._id));
        }
      }
    });
  
    // Sort the nested nodes at each level
    function sortNestedNodes(nodes) {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          node.children.sort((a, b) => a.sortOrder - b.sortOrder);
          sortNestedNodes(node.children);
        }
      });
    }
  
    sortNestedNodes(data.flatNodes);
  
    // Return the object from hierarchy where _id === data._id
    return idMap.get(data._id) || [];
  }