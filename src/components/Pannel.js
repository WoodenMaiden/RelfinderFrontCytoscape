import "./Pannel.css"

export default function Pannel(props) {
    let deployed = true;

    function deploy(e) {
        const pannel = document.getElementById('pannel')

        if(deployed) {
            setTimeout(() => {
                for (const pannelElement of pannel.children) {
                    pannelElement.style.display = "none"
                }
            }, 250)

            pannel.style.width = "0px"
        }
        else {
            setTimeout(() => {
                for (const pannelElement of pannel.children) {
                    pannelElement.style.display = "block"
                }
            }, 300)

            pannel.style.width = "90%"
        }

        deployed = !deployed
    }

    return (
        <div id="hamburgerMenu">
            <div id="pannel">
                <h3>RF Reformed</h3>
                <h4>Entries</h4>
                {/*<RFRForm />*/}
                <h4>Caption</h4>
                {/*RFRCaption*/}
                <h4>About</h4>
                <div>
                    <p>
                        Made by Yann POMIE
                    </p>
                </div>
            </div>
            <div id="hamburgerIcon" className="clickable" onClick={deploy}>
                <span className="material-icons-round">
                    chevron_left
                </span>
            </div>
        </div>
    )
}