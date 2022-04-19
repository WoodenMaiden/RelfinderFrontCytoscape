import "./CanvasButtons.css"

export default function CanvasButtons(props) {

    let cllbck = (!props.callback) ? () => "" : props.callback
    cllbck.bind(this)

    return (
        <div className="canvasbutton">
            <span className="material-icons-round clickable" onClick={cllbck}>
                {props.icon}
            </span>
        </div>
    )
}