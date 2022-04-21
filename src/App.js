import GraphCanvas from "./components/GraphCanvas";
import Pannel from "./components/Pannel"

import './App.css';
import {useState, useEffect} from "react";

function App() {

  const [entries, setEntries] = useState([])

/*
| | | | __ _ _ __   __| | | ___ _ __ ___
| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
|  _  | (_| | | | | (_| | |  __/ |  \__ \
|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

  function handleSubmit(e) {
    e.preventDefault()
    const formdata = new FormData(document.getElementById(e.target.id))
    
    const nodes = []

    for(const [key, val] of formdata.entries())
      if (val !== "") nodes.push(val)

    setEntries(nodes)
  }


  return (
    <div className="App">
        <GraphCanvas nodes={entries}/>
        <Pannel submitCallback={handleSubmit}/>
    </div>
  );
}

export default App;
