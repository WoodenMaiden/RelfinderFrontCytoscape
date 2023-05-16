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
    ["tap", (e) => {
        return {
            detailsID: v4(),
            x: e.cy.container().clientWidth / 2 + (Math.random() * 100 - 100),
            y: e.cy.container().clientHeight / 2 + (Math.random() * 100 - 100),
            data: e.target.data()?.nodeData ?? e.target.data() ?? {}
        }
    }]
    
])