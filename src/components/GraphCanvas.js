/* eslint-disable no-extend-native */
import {v4} from "uuid";
import {MultiDirectedGraph} from "graphology";
import cytoscape from "cytoscape/dist/cytoscape.esm";
import FileSaver from "file-saver"
import { useEffect, useState } from "react";

import { CircularProgress } from '@mui/material'

import CanvasButtons from "./CanvasButtons";
import NodeDetails from "./NodeDetails";
import { URL } from "../variables";

import "./GraphCanvas.css"

var lastInputs
var lastDepth
var lastGraph // we use var so we can access these from the component
export default function GraphCanvas(props) {

	let xDragged
	let yDragged
	let xLastDragged
	let yLastDragged

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


	const [ factorizedDetails, setFactorizedDetails ] = useState([])

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

		if (toDraw.nodes().length === 0) {
			cy.add({
				group: 'nodes',
				data : {
					id: "No graph found",
				},
				classes: ['ErrorNode']
			})
		}
		else if (!props.factorized) {
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
		} 
		else {
			toDraw.forEachNode((node, attributes) => {
				if (node.match(/^.+:\/\/.*/ig)){
					const nodeData = {}
					toDraw.forEachOutNeighbor(node, (neighbor, attribute) => {
						if (!neighbor.match(/^.+:\/\/.*/ig)){
							toDraw.forEachDirectedEdge(node, neighbor, (edge, edgeAttribute) => {
								const predicate = edgeAttribute.value
							
								if (nodeData.hasOwnProperty(predicate)) {
									if (Array.isArray(nodeData[predicate])) nodeData[predicate].push(neighbor)
									else nodeData[predicate] = [ nodeData[predicate], neighbor ]
								}
								else nodeData[predicate] = neighbor
							})
						}
					})

					//here we 'shorten' URI that could be simplified
					let getPrefix = (p) => p.includes('#')
						? p.substring(p.lastIndexOf('#') + 1)
						: p.substring(p.lastIndexOf('/') + 1);

					const factorizedNodeData = {}
					Object.keys(nodeData).forEach(
						(p, index, dt) => 
							(dt.findIndex((_p, _index) => getPrefix(p) === getPrefix(_p) && _index !== index) >= 0)
								? factorizedNodeData[p] = nodeData[p]
								: factorizedNodeData[getPrefix(p)] = nodeData[p]
					)

					cy.add({
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
				document.getElementById("loadingdiv").style.display = "flex"
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
				//const URL = (process.env.REACT_APP_API_URL.slice(-1) === "/") ? process.env.REACT_APP_API_URL.slice(0, -1) : process.env.REACT_APP_API_URL
	
				const fetchResult = await fetch(`${URL}/relfinder/${props.depth}`, requestOptions)
				const json = await fetchResult.json()
				graph.import(json)

				lastGraph = graph

				draw(graph)

				document.getElementById("loadingdiv").style.display = "none"

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

				document.getElementById("loadingdiv").style.display = "none"

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

		cy.on('tap', 'node', (e) => {
			setFactorizedDetails([...factorizedDetails, {
				detailsID: v4(),
				x: window.innerWidth / 2 + (Math.random() * 100 - 100),
				y: window.innerHeight / 2 + (Math.random() * 100 - 100),
				data: e.target.data()?.nodeData ?? e.target.data() ?? {}
			}])
		})

		cy.on("cxttapstart", e => {
			xDragged = e.renderedPosition.x
			yDragged = e.renderedPosition.y
			yLastDragged = yDragged
			xLastDragged = xDragged
		})

		cy.on("cxtdrag", e => {
			xDragged = e.renderedPosition.x
			yDragged = e.renderedPosition.y

			cy.panBy({
				x: xDragged - xLastDragged,
				y: yDragged - yLastDragged
			})

			yLastDragged = yDragged
			xLastDragged = xDragged			
		})

		cy.on("cxttapend", e => {
			yLastDragged = null
			xLastDragged = null
			yDragged = null
			xDragged = null
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
			output: 'blob',
			bg: "#FFFFFF"
		}), `RFR_${d.getDate()}/${d.getMonth()}/${d.getFullYear()}-${d.getHours()}h${d.getMinutes()}m${d.getSeconds()}`)
	}



	function rmHandlerDetails(id) {
		const toDelete = factorizedDetails.find(e => e.detailsID  === id)
		if (toDelete) 
			setFactorizedDetails(factorizedDetails.filter(e => e.detailsID !== id))
		
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

	function handleSearchChange(e) {
		const entry = e.target.value.trim()
		
		return (!entry)? []: cy.nodes().filter(
			node => node.data('label').includes(entry)
		).map(node => node.data('label')) 
	}

	return (
		<div id="GraphCanvas">
			<div style={{display: "none"}} id="loadingdiv">
				<CircularProgress id="loading" color="success" />
				<h3>This might take some time</h3>
			</div>
			{factorizedDetails?.map(
				elt => <NodeDetails x={elt.x} y={elt.y} data={elt.data} 
									key={elt.detailsID} detailsID={elt.detailsID}
									rmHandler={rmHandlerDetails}/>
			)}
			<div id="cyroot"></div>
			<ul id="btnlist">
				<li><CanvasButtons id="search" icon="search" type="search" changeCallback={handleSearchChange} submitCallback={handleSearch}/></li>
				<li><CanvasButtons id="camera" icon="photo_camera" callback={handleScreenshot}/></li>
				<li><CanvasButtons id="zoom" icon="add" callback={handleZoom}/></li>
				<li><CanvasButtons id="dezoom" icon="remove" callback={handleZoom}/></li>
			</ul>
		</div>
	)
}