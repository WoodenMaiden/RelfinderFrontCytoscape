export default function draw(graph, isFactorized = false, entryNodes = []) {
    const nodes = [], edges = []
    const isEntity = (e) => !!e.match(/^.+:\/\/.*/ig)

    //here we 'shorten' URI that could be simplified
    let getPrefix = (p) => p.includes('#')
        ? p.substring(p.lastIndexOf('#') + 1)
        : p.substring(p.lastIndexOf('/') + 1);

    graph.forEachNode((node, attr) => {

    if (isFactorized && !isEntity(node)) return;
    else if (isFactorized && isEntity(node)) {
        const nodeData = {}
        const factorizedNodeData = {}

        graph.forEachNeighbor(node, (neighbor, attribute) => {
        // for each neighbor we get the predicate and store it in nodeData

        if (!isEntity(neighbor))
            graph.forEachDirectedEdge(node, neighbor, (edge, edgeAttribute) => {
            const predicate = edgeAttribute.value

            if (nodeData.hasOwnProperty(predicate)) {
                if (Array.isArray(nodeData[predicate])) nodeData[predicate].push(neighbor)
                else nodeData[predicate] = [ nodeData[predicate], neighbor ]
            }
            else nodeData[predicate] = neighbor
            })
        })

        // here we shorten names
        Object.keys(nodeData).forEach(
        (p, index, dt) =>
            (dt.findIndex((_p, _index) => getPrefix(p) === getPrefix(_p) && _index !== index) >= 0)
                ? factorizedNodeData[p] = nodeData[p]
                : factorizedNodeData[getPrefix(p)] = nodeData[p]
        )

        nodes.push({
            group: 'nodes',
            data: {
                id: node,
                label: factorizedNodeData.label ?? node,
                nodeData : { ...factorizedNodeData }
                // we isolate the entity data into a nested because an otonlogy predicate
                // with the wrong name could override important keys
                // for instance http://owl.com/example#id could ovverride node.data.id and provoke a crash
            },
            selected: false,
            selectable: true,
            locked: false,
            grabbable: true,
            classes: ['Entity', entryNodes.includes(node)? 'EntryNode': '']
        })
    }
    else nodes.push({
            group: 'nodes',
            data : {
                id: node,
                label: node
            },
            selected: false,
            selectable: true,
            locked: false,
            grabbable: true,
            classes: (isEntity(node))? 
                ['Entity', entryNodes.includes(node)? 'EntryNode': '']:
                ['Literal']
        })
    })

    graph.forEachEdge((edge, attributes, source, target,
        sourceAttributes, targetAttributes, undirected
    ) => {
        const isEntity = !!target.match(/^.+:\/\/.*/ig)

        if (isFactorized && !isEntity) return;

        edges.push({
            group: 'edges',
            data: {
            id: edge,
            source: source,
            target: target,
            label: attributes.value
            },
            pannable: true
        })
    })

    return { nodes, edges }
}

export function focusNodeAndNeighbors(target, elements) {
    for (const elt of elements) {
        if (target.neighborhood().includes(elt) || elt === target){
            elt.style('label', elt.json().data.label);
            continue
        }
        elt.style('background-opacity', 0.05);
        elt.style('line-opacity', 0.05);
    }
} 

export function unFocusNodeAndNeighbors(elements) {
    for (const elt of elements) {
        elt.style('label', null)
        elt.style('background-opacity', 1);
        elt.style('line-opacity', 1);
    }
} 