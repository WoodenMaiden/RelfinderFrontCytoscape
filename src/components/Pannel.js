import InputForm from "./InputForm";
import { Help, FormatQuote, GitHub } from '@mui/icons-material'
import { Box, Switch, Slider, FormControlLabel} from '@mui/material'


import "./Pannel.css"

export default function Pannel(props) {
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

    
    return (
        <div id="hamburgerMenu">
            <div id="pannel">
                <h3>RF Reformed</h3>
                <h4>Entries</h4>
                    <InputForm submitCallback={middleSubmit}/> 
                    <Box sx={{display: "flex", flexDirection: "column", padding: "10px"}}>
                        <FormControlLabel control={<Switch onChange={handleSwitch} defaultChecked/>} label="Factorize graph" />
                        <FormControlLabel sx={{m: 0, width : (deployed)? "100%": 0}} control={<Slider onChange={props.depthCallback} 
                            aria-label="Temperature" valueLabelDisplay="auto" sx={{marginRight: 1}}
                            min={1} max={MAX_DEPTH} step={1} defaultValue={2} marks={genMark(MAX_DEPTH)}/>} 
                        label="Depth" />
                    </Box>
                <h4>Caption</h4>
                {/*RFRCaption*/}
                <h4>About</h4>
                <div id="aboutDiv">
                    <a href="https://github.com/WoodenMaiden/RelfinderFrontCytoscape/tree/buttons">
                        <GitHub />
                    </a>
                    <Help />
                    <FormatQuote />
                </div>
            </div>
            <div id="hamburgerIcon" className="clickable" onClick={deploy}>
                <span id="hamburgerIconSpan" className="material-icons-round">
                    chevron_left
                </span>
            </div>
        </div>
    )
}