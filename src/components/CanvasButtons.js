import "./CanvasButtons.css"

/* static */ let staticid = 0;

export default function CanvasButtons(props) {
    const btnid = ++staticid

    function deployForm(e) {
        e.preventDefault()

        if  (e.target.id === `btn${btnid}` || e.target.id === `icon${btnid}`) {
            const form = document.getElementById(`form${btnid}`)
            form.style.display = (form.style.display !== "none" || !form.style.display) ? "none": "flex"
        }
    }


    let clickCallback
    let submitCallback

    if (props.submitCallback) {
        clickCallback = deployForm
        submitCallback = props.submitCallback
    }
    else clickCallback = props.callback

    return (
        <div className="canvasbutton clickable" id={`btn${btnid}`} onClick={clickCallback}>
            {
                (props.type)? <form id={`form${btnid}`} name={`form${btnid}`} style={{display: "none"}} >
                                <input type={props.type} name="input1" onClick={(e) => e.target.select()}/>
                                <button className="clickable" onClick={submitCallback}>
                                    <span id={`submit${btnid}`} className="material-icons-round">
                                        done
                                    </span>
                                </button>
                              </form>
                            : ""
            }
            <span className="material-icons-round clickable" id={`icon${btnid}`}>
                {props.icon}
            </span>
        </div>
    )
}