import { useState } from "react";

import InputForm from "./InputForm";
import { Help, FormatQuote, GitHub, BubbleChart, Search, Add, Remove, CameraAlt } from '@mui/icons-material'
import { Box, Switch, Slider, FormControlLabel, Tabs, Tab } from '@mui/material'


import "./Pannel.css"

export default function Pannel(props) {
    const [value, setValue] = useState(0)

    let deployed = true;

    const MAX_DEPTH = 5
                    /* equivalent of range in python*/
                    /*              v               */
    const genMark = n => [...Array(n).keys()].map(m => (m+1 > 1 && m+1 < n)? {value: m+1}: {value: m+1, label:`${m+1}`})

    const middleSubmit = props.submitCallback
    const handleSwitch = props.switchCallback

    function deploy(e) {
        const pannel = document.getElementById('pannel')
        const hamburgerIcon = document.getElementById('hamburgerIconSpan')

        if(deployed) {
            setTimeout(() => {
                for (const pannelElement of pannel.children) {
                    pannelElement.style.display = "none"
                }
            }, 150)

            pannel.style.width = "0px"
            hamburgerIcon.style.transform = 'rotate(-180deg)'
        }
        else {
            setTimeout(() => {
                for (const pannelElement of pannel.children) {
                    if (pannelElement.id === "aboutDiv") pannelElement.style.display = "flex"
                    else pannelElement.style.display = "block"
                }
            }, 500-150)

            pannel.style.width = "90%"
            hamburgerIcon.style.transform = 'rotate(0deg)'
        }

        deployed = !deployed
    }


/*
     _   _                 _ _
	| | | | __ _ _ __   __| | | ___ _ __ ___
	| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
	|  _  | (_| | | | | (_| | |  __/ |  \__ \
	|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/ 

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div id="hamburgerMenu">
            <Box id="pannel">
                <h3>RF Reformed</h3>
                <Box id="aboutDiv" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                        <Tab value={0} icon={<BubbleChart />} />
                        <Tab value={1} icon={<GitHub />} />
                        <Tab value={2} icon={<Help />} />
                        <Tab value={3} icon={<FormatQuote />} />
                    </Tabs>
                </Box>

                <Box className="pannelShow" id="entries" sx={{display: (value === 0)? "block": "none"}}>
                    <h4>Entries</h4>
                        <InputForm submitCallback={middleSubmit}/> 
                        <Box sx={{display: "flex", flexDirection: "column", padding: "10px"}}>
                            <FormControlLabel control={<Switch onChange={handleSwitch} defaultChecked/>} label="Factorize graph" />
                            <FormControlLabel sx={{m: 0, width : (deployed)? "100%": 0}} control={<Slider onChange={props.depthCallback} 
                                aria-label="Temperature" valueLabelDisplay="auto" sx={{marginRight: 1}}
                                min={1} max={MAX_DEPTH} step={1} defaultValue={2} marks={genMark(MAX_DEPTH)}/>} 
                            label="Depth" />
                        </Box>
                </Box>

                <Box className="pannelShow" id="repo" sx={{display: (value === 1)? "block": "none"}}>
                    <h4>Repositories</h4>
                    <code>This frontend:</code> <p><a target="_blank" href="https://github.com/WoodenMaiden/RelfinderFrontCytoscape">https://github.com/WoodenMaiden/RelfinderFrontCytoscape</a></p>
                    <code>Relfinder API:</code> <p><a target="_blank" href="https://github.com/WoodenMaiden/RelFinderReformedNode">https://github.com/WoodenMaiden/RelFinderReformedNode</a></p>
                </Box>

                <Box className="pannelShow" id="about" sx={{display: (value === 2)? "block": "none"}}>
                    <h4>How to use</h4>
                    <code>L click:</code> <p>Move camera or node</p>
                    <code>R click:</code> <p>Move camera</p>
                    <code>Hover node or {<Search sx={{backgroundColor: "#ffffff", borderRadius: "50%"}}/>}:</code> <p>See node neighbors</p>
                    <code>Wheel or {<Add sx={{backgroundColor: "#ffffff", borderRadius: "50%"}}/>}/{<Remove sx={{backgroundColor: "#ffffff", borderRadius: "50%"}}/>}:</code> <p>Zoom/Dezoom</p>
                    <code>{<CameraAlt sx={{backgroundColor: "#ffffff", borderRadius: "50%"}}/>}:</code> <p>Take a picture (PNG) of this graph</p>
                    <code><Switch /> :</code> <p>Choose wether to render litterals or not</p>
                </Box>

                <Box className="pannelShow" id="quote" sx={{display: (value === 3)? "block": "none"}}>
                    <h4>Citations</h4>
                    <code>Cytoscape JS:</code> <p>Cytoscape.js: a graph theory library for visualisation and analysis<br/><br/>Franz M, Lopes CT, Huck G, Dong Y, Sumer O, Bader GD</p>
                    <code>Graphology JS:</code> <p>Guillaume Plique. (2021). Graphology, a robust and multipurpose Graph object for JavaScript.<br/><br/>Zenodo. <a target="_blank" href="https://doi.org/10.5281/zenodo.5681257">https://doi.org/10.5281/zenodo.5681257</a></p>
                    <code>Sparql-http-client: </code> <p><a target="_blank" href="https://github.com/zazuko/sparql-http-client">https://github.com/zazuko/sparql-http-client</a></p>

                </Box>
                
            </Box>
            <Box id="hamburgerIcon" className="clickable" onClick={deploy}>
                <span id="hamburgerIconSpan" className="material-icons-round">
                    chevron_left
                </span>
            </Box>
        </div>
    )
}