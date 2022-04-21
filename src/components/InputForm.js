import './inputForm.css'

export default function InputForm(props) {
    const MININPUT = 2
    let input = MININPUT;

    return (
        <form id="rfrform">
            <div id="inputs">
                <input type="search" id={`input${input-1}`} placeholder="URI or label"/>
                <input type="search" id={`input${input}`} placeholder="URI or label"/>
            </div>
            
            <div id="controls">
                <button type="button">
                    <span className="material-icons-round">
                        add
                    </span>
                </button>
                <button type="button">
                    <span className="material-icons-round">
                        remove
                    </span>
                </button>
                <button type="reset">
                    <span className="material-icons-round">
                        refresh
                    </span>
                </button>
            </div>

            <button type="submit" className="clickable">
                <h5>Find relations</h5>
                <i className="material-icons-round">
                    hub
                </i>
            </button>
        </form>
    )
}