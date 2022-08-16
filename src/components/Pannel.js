import { useEffect, useState } from "react";

import InputForm from "./InputForm";

import { Resizable } from "react-resizable";
import { Help, FormatQuote, GitHub, BubbleChart, Search, Add, Remove, ChevronLeft, CameraAlt } from '@mui/icons-material'
import { Box, Switch, Slider, FormControlLabel, Tabs, Tab, IconButton } from '@mui/material'

import "./Pannel.css"

export default function Pannel(props) {
    const MAX_DEPTH = 5
    const MIN_WIDTH = window.innerWidth * 30 / 100
    const MAX_WIDTH = window.innerWidth;

    const [value, setValue] = useState(0);
    const [isDeployed, setDeployed] = useState(true);
    const [width, setWidth] = useState(MIN_WIDTH)

                    /* equivalent of range in python*/
                    /*              v               */
    const genMark = n => [...Array(n).keys()].map(m => (m+1 > 1 && m+1 < n)? {value: m+1}: {value: m+1, label:`${m+1}`})

    const middleSubmit = props.submitCallback
    const handleSwitch = props.switchCallback

    function deploy(deployed) {
        const pannel = document.getElementById('pannel')
        const menu = document.getElementById('hamburgerMenu')
        const bar = document.getElementById('hamburgerIcon')
        const hamburgerIcon = document.getElementById('hamburgerIconSpan')

        bar.style.pointerEvents = "auto"

        if(!deployed) {
            setTimeout(() => {
                for (const pannelElement of pannel.children)
                    pannelElement.style.visibility = "collapse"
            }, 150)

            pannel.style.width = "0px"
            pannel.style.paddingLeft = "0px"
            menu.style.pointerEvents = "none"    
            hamburgerIcon.style.transform = 'rotate(-180deg)'
        }
        else {
            setTimeout(() => {
                for (const pannelElement of pannel.children)
                    pannelElement.style.visibility = "visible"
            }, 500-150)

            pannel.style.width = "90%"
            pannel.style.paddingLeft = "5px"
            menu.style.pointerEvents = "auto"
            hamburgerIcon.style.transform = 'rotate(0deg)'
        }
    }

    useEffect(() => {
        deploy(isDeployed)
    }, [isDeployed])

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
    const handleDeploy = (event) => {
        setDeployed(!isDeployed)
    };
    const handleResize = (event, {element, size, handle}) => {
        if (size.width >= MIN_WIDTH && size.width <= MAX_WIDTH) setWidth(size.width)
    };

    return (
        <Box sx={{display: "flex", flexDirection: "row"}}>
            <Resizable  width={width} height={100} onResize={handleResize}
                        handle={
                            <Box id="hamburgerIcon" className="clickable"
                                 sx={{cursor: (isDeployed)?"col-resize" :"auto"}} > 
                                <IconButton onClick={handleDeploy} sx={{height: "10%"}} children={<ChevronLeft id="hamburgerIconSpan"/>}/>
                            </Box>
                        } handleSize={[1]} resizeHandles={['e']}>
                <Box id="hamburgerMenu" sx={{width: `${width}px`}}>
                    <Box id="pannel" sx={{paddingLeft: '5px'}}>
                        <Box id="pannelHeader">
                            <h3>RF Reformed</h3>
                            <Box id="aboutDiv" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                                    <Tab value={0} icon={<BubbleChart />} />
                                    <Tab value={1} icon={<GitHub />} />
                                    <Tab value={2} icon={<Help />} />
                                    <Tab value={3} icon={<FormatQuote />} />
                                </Tabs>
                            </Box>
                        </Box>

                        <Box id="pannelBody">
                            <Box className="pannelShow" id="entries" sx={{display: (value === 0)? "block": "none"}}>
                                <h4>Entries</h4>
                                    <InputForm submitCallback={middleSubmit}/> 
                                    <Box sx={{display: "flex", flexDirection: "column", padding: "10px"}}>
                                        <FormControlLabel control={<Switch onChange={handleSwitch} defaultChecked/>} label="Factorize graph" />
                                        <FormControlLabel sx={{m: 0, width : (isDeployed)? "100%": 0}} control={<Slider onChange={props.depthCallback} 
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
                    </Box>
                </Box>
            </Resizable>
        </Box>
    )
}