
import { useReducer } from "react";
import { CircularProgress } from "@mui/material";
import NodeDetails from "./components/NodeDetails";
import CytoscapeComponent from "react-cytoscapejs";
import MultiDirectedGraph from "graphology";


import Pannel from "./components/Pannel"
import { URL } from "./variables"
import { listeners } from "./lib/cytoscape";
import draw from "./lib/draw";

import './App.css';

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
      edges: []
    }
  )

  const cytoscapeStyle = [
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
          elements={[ ...state.nodes, ...state.edges ]} pan={{ x:0, y:0 }}
          zoom={1} cy={(cy) => {
            cy.removeAllListeners()

            cy.on("mouseover", listeners.get("mouseover"))
            cy.on("mouseout", listeners.get("mouseout"))
            cy.on("tap", "node", (e) => {
              dispatchState({
                type: "addNodeDetails",
                nodeDetails: listeners.get("tap")(e)
              })
            })

          }}
          style={{width: "100%", height: "100%"}}
        />
        <ul id="btnlist">
          {/*<li><CanvasButtons id="search" icon="search" type="search" changeCallback={handleSearchChange} submitCallback={handleSearch}/></li>*/}
          {/*<li><CanvasButtons id="camera" icon="photo_camera" callback={handleScreenshot}/></li>*/}
          {/*<li><CanvasButtons id="zoom" icon="add" callback={handleZoom}/></li>*/}
          {/*<li><CanvasButtons id="dezoom" icon="remove" callback={handleZoom}/></li>*/}
        </ul>
      </div>
    </div>
  );
}

export default App;
