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
				selector: 'Entity',
				style: {
					'background-color': 'red'
				}
			},
			{
				selector: 'Literal',
				style: {
					'background-color': 'green'
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
		wheelSensitivity: 1,
		pixelRatio: 'auto',
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
				console.log((!node.match(/^.+:\/\/.*/ig)) ? 'Entity' : 'Literal')
				cy.add({
					group: 'nodes',
					data: {
						id: node
					},
					selected: false,
					selectable: true,
					locked: false,
					grabbable: true,
					classes: (!node.match(/^.+:\/\/.*/ig)) ? ['Entity'] : ['Literal']
				})
			})

			//TODO print edges and fix nodes coloration

			console.log("constructed!")
			cy.ready(() => {
				cy.layout(layoutOptions).run()
				console.log(cy.nodes().size)
				console.log("done! should be prompted")
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