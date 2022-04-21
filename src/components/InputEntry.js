export default function InputEntry(props) {
    const rmHandler =  props.rmHandler.bind(this)
    const input = props.input

    return (
        <div className="controls">
            <input type="search" id={`input${input}`} placeholder="URI or label"/>
            <button type="button" id={`rm${input}`} onClick={rmHandler}>
                <span className="material-icons-round">
                    close
                </span>
            </button>
        </div>
    )
}