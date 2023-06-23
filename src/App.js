
import { useReducer } from "react";
import { CircularProgress } from "@mui/material";
import CytoscapeComponent from "react-cytoscapejs";
import { MultiDirectedGraph } from "graphology";
import FileSaver from "file-saver"

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

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

import cytoscapeStyle from "./cytoscape-style.json";

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

  // const layoutOptions = {
  //   name: 'breadthfirst',

  //   ready: function (e) {
  //     e.cy.nodes().forEach(function (n) {
  //         console.log(n)
  //         n.position(n.position())
  //     })
  //   },

  //   stop: function () {
      
  //   }
  // }

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
        })

        return;
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
    } finally {
      dispatchState({
        type: "changePan",
        pan: {
          position: { x: 0, y: 0 },
          zoom: 1
        }
      })
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
    dispatchState({
      type: "changePan",
      pan: { 
        position: cytoscapeInstance.pan(),
        zoom: cytoscapeInstance.zoom() + level 
      }
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
        <CytoscapeComponent stylesheet={cytoscapeStyle} //layout={layoutOptions}
          elements={[ ...state.nodes, ...state.edges ]} wheelSensitivity={0.3}
          style={{width: "100%", height: "100%"}} panningEnabled={true}
          userPanningEnabled={true} userZoomingEnabled={true}
          minZoom={0.1} maxZoom={2} pan={state.pan.position}
          cy={
            (cy) => {
              cy.pan(state.pan.position)
              cy.zoom(state.pan.zoom)
              
              cy.removeAllListeners()
              
              cy.on("scrollzoom", e => listeners.get("scrollzoom")(e, dispatchState))
              cy.on("mouseover", listeners.get("mouseover"))
              cy.on("mouseout", listeners.get("mouseout"))
              cy.on("tap", "node", e => listeners.get("tap")(e, dispatchState))
              cy.on("tapend", e => listeners.get("tapend_canvas")(e, dispatchState))

              cytoscape = cy
            }
          }
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
              onFocusEntity={
                (entry) => {
                  const entity = cytoscape.$(`node[label = "${entry}"]`)[0]
                  if (entity) {
                    cytoscape.animate({
                      center: {
                        eles: [entity],
                      },
                      fit: {
                        eles: entity.neighborhood(),
                      },
                      complete: () => dispatchState({
                        type: "changePan",
                        pan: {
                          position: cytoscape.pan(),
                          zoom: cytoscape.zoom()
                        }
                      })
                    })
                  }
                }
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
            <CanvasButton icon={<CenterFocusWeakIcon />} clickCallback={
              () => cytoscape.animate({
                pan: { x: 0, y: 0 },
                zoom: 1,
                complete: () => dispatchState({
                  type: "changePan",
                  pan: {
                    position: { x: 0, y: 0 },
                    zoom: 1
                  }
                })
              })

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
