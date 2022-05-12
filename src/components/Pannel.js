import InputForm from "./InputForm";
import { Help, FormatQuote, GitHub } from '@mui/icons-material'
import { Switch, FormControlLabel} from '@mui/material'


import "./Pannel.css"

export default function Pannel(props) {
    let deployed = true;

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
                    <FormControlLabel className="clickable" control={<Switch onChange={handleSwitch} defaultChecked/>} label="Factorize graph" />
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