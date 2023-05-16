
import { useReducer } from "react";
import { CircularProgress } from "@mui/material";
import CytoscapeComponent from "react-cytoscapejs";
import { MultiDirectedGraph } from "graphology";
import FileSaver from "file-saver"

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import NodeDetails from "./components/NodeDetails";
import CanvasButton from "./components/CanvasButtons";
import Pannel from "./components/Pannel"
import { URL } from "./variables"
import { listeners } from "./lib/cytoscape";

import './App.css';
import SearchBar from "./components/SearchBar";

import draw, { 
  focusNodeAndNeighbors, 
  unFocusNodeAndNeighbors 
} from "./lib/draw";

function App() {
  const [ state, dispatchState ] = useReducer(
    (state, action) => {
      switch(action.type) {
        case "changeEntries":
          return {
            ...state,
            entries: action.entries
          }
        case "changeDepth":
          return {
            ...state,
            depth: action.depth
          }
        case "changeLoading":
          return {
            ...state,
            loading: action.loading
          }
        case "rmNodeDetails":
          return {
            ...state,
            nodeDetails: state.nodeDetails.filter((node) => node.detailsID !== action.detailsID)
          }
        case "addNodeDetails":
          return {
            ...state,
            nodeDetails: [...state.nodeDetails, action.nodeDetails]
          }
        case "changeSearchMode":
          return {
            ...state,
            searchMode: action.searchMode
          }
        case "changeFactorize":
          return {
            ...state,
            factorized: action.factorized
          }
        case "changeNodes":
          return {
            ...state,
            nodes: action.nodes
          }
        case "changeEdges":
          return {
            ...state,
            edges: action.edges
          }
        case "changeGraph":
          return {
            ...state,
            nodes: action.nodes,
            edges: action.edges
          }
        case "changePan":
          return {
            ...state,
            pan: action.pan
          }

        default: return state
      }
    },
    {
      entries: [],
      depth: 2,
      factorized: true,
      loading: false,
      nodeDetails: [],
      searchMode: false,
      nodes: [],
      edges: [],
      pan: { 
        position: { x: 0, y: 0 }, 
        zoom: 1 
      },
    }
  )

  const cytoscapeStyle = [
    {
      selector: 'node,edge',
      style: {
        'text-background-opacity': .8,
        'text-background-color': '#e0e0e0',
        'text-background-shape': 'roundrectangle',
        'text-border-width': .5,
        'text-border-color': '#000000',
        'text-border-opacity': .8,
      }
    },
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
      selector: '.EntryNode',
      style: {
        'shape': 'round-triangle',
        'label': 'data(label)'
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
  ]

  const layoutOptions = {
    name: 'breadthfirst',

    ready: function () {
      
    },
    stop: function () {
      
    }
  }

  /*
  | | | | __ _ _ __   __| | | ___ _ __ ___
  | |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
  |  _  | (_| | | | | (_| | |  __/ |  \__ \
  |_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
  */

  function handleInputsChange(entries) {
    dispatchState({
      type: "changeEntries",
      entries
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const graph = new MultiDirectedGraph()
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "nodes": state.entries,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      console.log("fetching...")

      const fetchResult = await fetch(`${URL}/relfinder/${state.depth}`, requestOptions)
      const json = await fetchResult.json()
      graph.import(json)

      console.log("graph imported, drawing...")

      if (graph.nodes().length === 0) {
        dispatchState({
          type: "changeNodes",
          nodes: [
            {
              group: 'nodes',
              data : {
                id: "No graph found",
              },
              classes: ['ErrorNode']
            }
          ]
        }); return;
      }

      const { nodes, edges } = draw(graph, state.factorized, state.entries)
      
      dispatchState({
        type: "changeGraph",
        nodes,
        edges
      })
      
    } catch (e) {
      console.error(e)
      dispatchState("changeNodes", [
        {
          group: 'nodes',
          data : {
            id: e.toString(),
          },
          classes: ['ErrorNode']
        }
      ])
    }
  }

  function handleFactorizeSwitch(e) {
    dispatchState({
      type: "changeFactorize",
      factorized: e.target.checked
    })
  }

  function handleDepth(e) {
    dispatchState({
      type: "changeDepth",
      depth: e.target.value
    })
  }

  function rmHandlerDetails(id) {
    dispatchState({
      type: "rmNodeDetails",
      detailsID: id
    })
  }

  function zoomHandler(cytoscapeInstance, level) {
    cytoscapeInstance.zoom({
      level: cytoscapeInstance.zoom() + level,
      renderedPosition: { x: cytoscapeInstance.pan().x/2, y: cytoscapeInstance.pan().y/2 }
    })
  }

  function handleScreenshot(cytoscapeInstance) {
		const d = new Date()
		FileSaver.saveAs(cytoscapeInstance.png({
			output: 'blob',
			bg: "#FFFFFF"
		}), `RFR_${d.getDate()}/${d.getMonth()}/${d.getFullYear()}-${d.getHours()}h${d.getMinutes()}m${d.getSeconds()}`)
	}

  function handleSearchSuggestions(nodes, entry) {
    entry = entry.trim()
    return entry === "" ? []:  nodes.filter(node => 
      node.data.label?.toLowerCase().includes(entry.toLowerCase())
    ).map(node => node.data.label)
  }

  let cytoscape; // a handle to the cytoscape instance to be used in handlers
  return (
    <div className="App">
      <Pannel
          switchCallback={handleFactorizeSwitch}
          submitCallback={handleSubmit}
          depthCallback={handleDepth}
          changeInputsCallback={handleInputsChange}
      />


      <div id="GraphCanvas">
        <div style={{display: !state.loading? "none": "flex"}} id="loadingdiv">
          <CircularProgress id="loading" color="success" />
          <h3>Loading...</h3>
        </div>
        {state.nodeDetails?.map(
            elt => <NodeDetails x={elt.x} y={elt.y} data={elt.data}
                      key={elt.detailsID} detailsID={elt.detailsID}
                      rmHandler={rmHandlerDetails}/>
        )}
        <CytoscapeComponent stylesheet={cytoscapeStyle} layout={layoutOptions} 
          elements={[ ...state.nodes, ...state.edges ]} pan={{ ...state.pan.position }}
          zoom={state.pan.zoom} cy={(cy) => {
            cy.removeAllListeners()
            
            cy.on("scrollzoom", (e) => {
              // dispatchState({
              //   type: "changePan",
              //   pan: {
              //     position: { ...e.cy.pan()},
              //     zoom: e.cy.zoom()
              //   }
              // })
            })
            cy.on("mouseover", listeners.get("mouseover"))
            cy.on("mouseout", listeners.get("mouseout"))
            cy.on("tap", "node", (e) => {
              dispatchState({
                type: "addNodeDetails",
                nodeDetails: listeners.get("tap")(e)
              })
            })

            cytoscape = cy
          }}
          style={{width: "100%", height: "100%"}}
        />
        <ul id="btnlist">
          <li>
            <CanvasButton icon={<SearchIcon />}>
              <SearchBar suggestionLogic={
                (entry) => handleSearchSuggestions(state.nodes, entry)
              }
              confirmEntry={
                (entry) => { 
                  focusNodeAndNeighbors(
                    cytoscape.$(`node[label = "${entry}"]`)[0],
                    cytoscape.elements()
                  )
                }
              }
              resetEntry={
                () => unFocusNodeAndNeighbors(cytoscape.elements())
              }
              />
            </CanvasButton>
          </li>
          <li>
            <CanvasButton icon={<CameraAltIcon />} clickCallback={
              () => handleScreenshot(cytoscape)
            }/>
          </li>
          <li>
            <CanvasButton icon={<AddIcon />} clickCallback={
              () => zoomHandler(cytoscape, 0.1)
            }/>
          </li>
          <li>
            <CanvasButton icon={<RemoveIcon/>} clickCallback={
              () => zoomHandler(cytoscape, -0.1)
            }/>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
