import {MultiDirectedGraph} from "graphology";
import cytoscape from "cytoscape/dist/cytoscape.esm";
import FileSaver from "file-saver"

import { useEffect } from "react";

import "./GraphCanvas.css"

import CanvasButtons from "./CanvasButtons";


var lastInputs
var lastDepth
var lastGraph // we use var so we can access these from the component
export default function GraphCanvas(props) {

	if (!lastDepth) lastDepth = undefined
	
	// https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
	Array.prototype.equals = function (array) {
		// if the other array is a falsy value, return
		if (!array)
			return false;
	
		// compare lengths - can save a lot of time 
		if (this.length !== array.length)
			return false;
	
		for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;       
			}           
			else if (this[i] !== array[i]) { 
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;   
			}           
		}       
		return true;
	}
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, "equals", {enumerable: false});


/*
     ____      _
	/ ___|   _| |_ ___  ___  ___ __ _ _ __   ___
	| |  | | | | __/ _ \/ __|/ __/ _` | '_ \ / _ \
	| |__| |_| | || (_) \__ \ (_| (_| | |_) |  __/
	\____\__, |\__\___/|___/\___\__,_| .__/ \___|
	      |___/                       |_|
 */

	cytoscape.warnings(false)

	function draw (toDraw) {
		if (!toDraw) return ;
		if (!props.factorized) {
			toDraw.forEachNode((node, attributes) => {
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

			toDraw.forEachDirectedEdge((edge, attributes, source, target,
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
		} else {
			toDraw.forEachNode((node, attributes) => {
				if (node.match(/^.+:\/\/.*/ig)){
					const nodeData = {}
					toDraw.forEachOutNeighbor(node, (neighbor, attribute) => {
						if (!neighbor.match(/^.+:\/\/.*/ig)){
							toDraw.forEachDirectedEdge(node, neighbor, (edge, edgeAttribute) => {
								nodeData[`${edge}`] = neighbor
							})
						}
					})
					cy.add({
						group: 'nodes',
						data: {
							id: node,
							label: node,
							...nodeData
						},
						selected: false,
						selectable: true,
						locked: false,
						grabbable: true,
						classes: ['Entity']
					})
				}
			})

			toDraw.forEachDirectedEdge((edge, attributes, source, target,
									sourceAttributes, targetAttributes, undirected) => {
				if (target.match(/^.+:\/\/.*/ig)) {
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
				}
			})
		}

		console.log(`total: ${cy.elements('nodes').length}, entities: ${cy.elements(".Entity").length}, litteral: ${cy.elements(".Literal").length}`)
	}


	const layoutOptions = {
		name: 'breadthfirst',

		ready: function () {},
		stop: function () {}
	}

	let cy = cytoscape();
	// we are doing this in a use effect since it is executed after the dom finished rendering
	useEffect(() => {		
		 cy = cytoscape({
			//visual
			container: document.getElementById("cyroot"),
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
				}, 
				{
					selector: '.ErrorNode',
					style: {
						'background-color': '#a32222',
						'shape': 'ellipse',
						'width': '100%',
						'height': '25%',
						'content': 'data(id)',
						'color': '#ffffff',
        				'text-valign': 'center',
        				'text-halign': 'center',
						'text-outline-width': 2,
						'text-outline-color': '#a32222',
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
			pixelRatio: 'auto'
		})


		const fetchData = async () => {
			try {
				const graph = new MultiDirectedGraph()

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
	
				const raw = JSON.stringify({
					"nodes": props.nodes
				});
	
				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};
				const URL = (process.env.REACT_APP_API_URL.slice(-1) === "/") ? process.env.REACT_APP_API_URL.slice(0, -1) : process.env.REACT_APP_API_URL
	
				const fetchResult = await fetch(`${URL}/relfinder/${props.depth}`, requestOptions)
				const json = await fetchResult.json()
				graph.import(json)

				lastGraph = graph

				draw(graph)

				cy.layout(layoutOptions).run()
				zoomRatioBtn = cy.zoom() / 2
			}
			catch(e) {
				//maybe put a label if we can here

				cy.add({
					group: 'nodes',
					data : {
						id: e.toString(),
					},
					classes: ['ErrorNode']
				})

				cy.layout(layoutOptions).run()
				zoomRatioBtn = cy.zoom() / 2
			}
		}



		if  (props.nodes.length >= 2 && 
			((!lastGraph || !props.nodes.equals(lastInputs)) || 
			(!lastDepth || lastDepth !== props.depth))) {
				lastDepth = props.depth						
				fetchData();
		}
		else {
			draw(lastGraph)
			cy.layout(layoutOptions).run()
			zoomRatioBtn = cy.zoom() / 2
		}
			

		lastInputs = props.nodes
	

		cy.on("mouseover", e => {
			if (!searchMode && e.target !== cy && e.target.isNode()) {
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
			if (!searchMode && e.target !== cy) {
				for (const elt of cy.elements()) {
					elt.style('label', null)
					elt.style('background-opacity', 1);
					elt.style('line-opacity', 1);
				}
			}
		})

		return function cleanListeners() {
			cy.removeAllListeners()
		}
	})


/*
     _   _                 _ _
	| | | | __ _ _ __   __| | | ___ _ __ ___
	| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
	|  _  | (_| | | | | (_| | |  __/ |  \__ \
	|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
 */

	let searchMode = false
	function handleSearch(e) {
		e.preventDefault()

		const inputElt = (e.target.tagName === "BUTTON")
			? e.target.parentNode.children[0]
			: e.target.parentNode.parentNode.children[0]
		const input = inputElt.value.trim()

		if (!input) return;

		searchMode = !searchMode
		const spanIcon = (e.target.tagName === "BUTTON")
			? document.getElementById(e.target.children[0].id)
			: document.getElementById(e.target.id);


		(searchMode)? spanIcon.innerText = "clear" : spanIcon.innerText = "done"

		if (searchMode) {
			for (const elt of cy.elements()) {
				if (cy.getElementById(input).neighborhood().includes(elt) || elt === cy.getElementById(input)) {
					elt.style('label', elt.json().data.label);
					continue
				}
				elt.style('background-opacity', 0.05);
				elt.style('line-opacity', 0.05);
			}
		}
		else {
			inputElt.value = ""
			for (const elt of cy.elements()) {
				elt.style('label', null)
				elt.style('background-opacity', 1);
				elt.style('line-opacity', 1);
			}
		}
	}

	function handleScreenshot(e) {
		const d = new Date()
		FileSaver.saveAs(cy.png({
			output: 'blob'
		}), `RFR_${d.getDate()}/${d.getMonth()}/${d.getFullYear()}-${d.getHours()}:${d.getMinutes()}`)
	}

	// because the basic zoom depends on the initial layout: a fixed value can be too much
	let zoomRatioBtn
	function handleZoom(e) {
		if (e.target.textContent === "add")
			cy.zoom({
				level: cy.zoom() + zoomRatioBtn,
				position: {
					x: cy.pan().x/2,
					y: cy.pan().y/2
				}
			})

		if (e.target.textContent === "remove")
			cy.zoom({
				level: cy.zoom() - zoomRatioBtn,
				position: {
					x: cy.pan().x/2,
					y: cy.pan().y/2
				}
			})
	}


	return (
		<div id="GraphCanvas">
			<div id="cyroot">
			</div>
			<ul>
				<li><CanvasButtons icon="search" type="search" submitCallback={handleSearch}/></li>
				<li><CanvasButtons icon="photo_camera" callback={handleScreenshot}/></li>
				<li><CanvasButtons icon="add" callback={handleZoom}/></li>
				<li><CanvasButtons icon="remove" callback={handleZoom}/></li>
			</ul>
		</div>
	)
}