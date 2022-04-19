import {useEffect, useState} from "react";
import {MultiDirectedGraph} from "graphology";
import cytoscape from "cytoscape/dist/cytoscape.esm";

import "./GraphCanvas.css"

export default function GraphCanvas(props) {

	const [graph, setGraph] = useState(new MultiDirectedGraph())

	const layoutOptions = {
		name: 'breadthfirst',

		ready: function () {},
		stop: function () {},
	}

	const cy = cytoscape({
		//visual
		container: undefined,
		style: [
			{
				selector: '.Entity',
				style: {
					'background-color': 'red'
				}
			},
			{
				selector: '.Literal',
				style: {
					'background-color': 'green'
				}
			},
			{
				selector: 'edge',
				style: {
					'curve-style': 'bezier',
					'target-arrow-shape': 'triangle',
				}
			}
		],


		// initial viewport state:
		zoom: 1,
		pan: { x: 0, y: 0 },

		// interaction options:
		minZoom: 1e-50,
		maxZoom: 1e50,
		zoomingEnabled: true,
		userZoomingEnabled: true,
		panningEnabled: true,
		userPanningEnabled: true,
		boxSelectionEnabled: true,
		selectionType: 'single',
		touchTapThreshold: 8,
		desktopTapThreshold: 4,
		autolock: false,
		autoungrabify: false,
		autounselectify: false,
		multiClickDebounceTime: 250,

		// rendering options:
		headless: false,
		styleEnabled: true,
		hideEdgesOnViewport: false,
		textureOnViewport: false,
		motionBlur: false,
		motionBlurOpacity: 0.2,
		wheelSensitivity: 0.3,
		pixelRatio: 'auto',
	})


	cy.on("mouseover", e => {
		if (e.target !== cy && e.target.isNode()) {
			for (const elt of cy.elements()) {
				if (e.target.neighborhood().includes(elt) || elt === e.target){
					elt.style('label', elt.json().data.label);
					continue
				}
				elt.style('background-opacity', 0.05);
				elt.style('line-opacity', 0.05);
			}
		}
	})

	cy.on("mouseout", e => {
		if (e.target !== cy) {
			for (const elt of cy.elements()) {
				elt.style('label', null)
				elt.style('background-opacity', 1);
				elt.style('line-opacity', 1);
			}
		}
	})



	useEffect(() => {
		graph.clear()
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		//SAMPLE DATA
		const raw = JSON.stringify({
			"nodes": [
				"http://purl.obolibrary.org/obo/GO_0030599",
				"http://purl.uniprot.org/uniprot/M7Y4A4"
			]
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		const URL = (process.env.REACT_APP_API_URL.slice(-1) === "/") ? process.env.REACT_APP_API_URL.slice(0, -1) : process.env.REACT_APP_API_URL

		fetch(`${URL}/relfinder/2`, requestOptions).then((res) => res.json().then((data) => {
			graph.import(data);
			cy.mount(document.getElementById("cyroot"))

			//constructing graph
			graph.forEachNode((node, attributes) => {
				cy.add({
					group: 'nodes',
					data: {
						id: node,
						label: node
					},
					selected: false,
					selectable: true,
					locked: false,
					grabbable: true,
					classes: (!node.match(/^.+:\/\/.*/ig)) ? ['Literal'] : ['Entity']
				})
			})

			graph.forEachDirectedEdge((edge, attributes, source, target,
									  sourceAttributes, targetAttributes, undirected) => {
				cy.add({
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
			cy.ready(() => {
				cy.layout(layoutOptions).run()
			})
		}))


	})

	return (
		<div id="GraphCanvas">
			<div id="cyroot">

			</div>
		</div>
	)
}