import { v4 } from "uuid";

import { 
    focusNodeAndNeighbors, 
    unFocusNodeAndNeighbors 
} from "./draw";

export const listeners = new Map([
    ["mouseover", (e) => {
        if (e.target !== e.cy && e.target?.isNode()) {
            focusNodeAndNeighbors(e.target, e.cy.elements())
        }
    }],
    ["mouseout", (e)=> { 
        if (e.target !== e.cy) {
            unFocusNodeAndNeighbors(e.cy.elements())
        }
    }],
    ["tap", (e, dispatcher) => {
        dispatcher({
            type: "addNodeDetails",
            nodeDetails: {
                detailsID: v4(),
                x: e.cy.container().clientWidth / 2 + (Math.random() * 100 - 100),
                y: e.cy.container().clientHeight / 2 + (Math.random() * 100 - 100),
                data: e.target.data()?.nodeData ?? e.target.data() ?? {}
            }
        })
    }],
    ["scrollzoom", (e, dispatcher) => {
        // allow to dispatch canvas padding/zoom
        // so it is kept between renderings
        e.preventDefault() 
        dispatcher({
            type: "changePan",
            pan: {
                position: e.cy.pan(),
                zoom: e.cy.zoom()
            }
        })
    }],
    ["tapend_canvas", (e, dispatcher) => {
        if (e.target === e.cy) { // to target only the canvas
            dispatcher({
                type: "changePan",
                pan: {
                    zoom: e.cy.zoom(),
                    position: e.cy.pan()
                }
            })
        }
        // else we check if it is a node
        else if (e.target?.isNode()) {
            const nodes = e.cy.nodes().map(node => {
                return {
                    group: node.group,
                    data: node.data(),
                    selected: false,
                    selectable: true,
                    locked: false,
                    grabbable: true,
                    classes: node.classes(),
                    position: node.data().id === e.target.data().id
                    // https://stackoverflow.com/a/51526837 basically
                    // we take our visual position, substract the pan
                    // to get rid off the offset between visual and model
                    // positions, we then divide by the zoom to adjust
                        ? {
                            x: (
                                e.target.renderedPosition().x - 
                                e.cy.pan().x
                            ) / e.cy.zoom(),
                            y: (
                                e.target.renderedPosition().y -
                                e.cy.pan().y
                            ) / e.cy.zoom()
                        }
                        : node.position()
                }
            })

            dispatcher({
                type: "changeNodes",
                nodes
            })
        }
        
    }]
])