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