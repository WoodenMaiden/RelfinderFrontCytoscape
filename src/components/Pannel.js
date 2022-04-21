import InputForm from "./InputForm";

import "./Pannel.css"

import github from "./GitHub-Mark-32px.png"

export default function Pannel(props) {
    let deployed = true;

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
                   <InputForm /> 
                <h4>Caption</h4>
                {/*RFRCaption*/}
                <h4>About</h4>
                <div id="aboutDiv">
                    <a href="https://github.com/WoodenMaiden/RelfinderFrontCytoscape/tree/buttons">
                        <img alt="github" src={github}/>
                    </a>
                    <div className="aboutIcon clickable">
                        <i className="material-icons-round">
                            help
                        </i>
                    </div>
                    <div className="aboutIcon clickable">
                        <i className="material-icons-round">
                            format_quote
                        </i>
                    </div>
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