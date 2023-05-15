import { v4 } from "uuid";

export const listeners = new Map([
    ["mouseover", (e) => {
        if (e.target !== e.cy && e.target?.isNode()) {
            for (const elt of e.cy.elements()) {
                if (e.target.neighborhood().includes(elt) || elt === e.target){
                    elt.style('label', elt.json().data.label);
                    continue
                }
                elt.style('background-opacity', 0.05);
                elt.style('line-opacity', 0.05);
            }
        }
    }],
    ["mouseout", (e)=> { 
        if (e.target !== e.cy) {
				for (const elt of e.cy.elements()) {
					elt.style('label', null)
					elt.style('background-opacity', 1);
					elt.style('line-opacity', 1);
				}
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