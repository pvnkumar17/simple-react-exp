export function convertToNestedJson(inputObject1) {
    const inputObject = [...inputObject1]
    const idMap = new Map();

    // Create a map of ids to nodes for quick lookup
    inputObject.forEach((entry) => {
        entry.flatNodes.forEach((node) => {
            idMap.set(node._id, node);
        });
    });

    // Traverse the data and build the hierarchy
    inputObject.forEach((entry) => {
        entry.flatNodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                node.children = node.children.map((childId) => idMap.get(childId));
            }
        });
    });

    // Filter out nodes with parentId (they are now part of the hierarchy)
    const hierarchy = inputObject.map((entry) => entry.flatNodes.filter((node) => !node.parentId));

    // Flatten the hierarchy into a single array of objects
    const result = hierarchy.reduce((acc, val) => acc.concat(val), []);

    return result;
}