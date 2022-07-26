import { useEffect, useState } from "react";
import { 
    Box,
    Stack, 
    Typography, 
} from "@mui/material";

import "./CanvasButtons.css"

export default function CanvasButtons(props) {
    const btnid = props.id

    const [suggestions, setSuggestions] = useState([])
    const [indexSuggestion, setIndexSuggestion] = useState(0)

    function deployForm(e) {
        e.preventDefault()

        if  (e.target.id === `btn${btnid}` || e.target.id === `icon${btnid}`) {
            const form = document.getElementById(`form${btnid}`)
            form.style.display = (form.style.display !== "none" || !form.style.display) ? "none": "flex"
        }
    }


    let clickCallback
    let submitCallback
    let changeCallback

    if (props.submitCallback) {
        clickCallback = deployForm
        submitCallback = props.submitCallback
        changeCallback = function (e) { 
            if (!props.changeCallback) return;
            const sug = props.changeCallback(e)
            setSuggestions([ ...sug ])
            if (sug === []) setIndexSuggestion(0)
        }
    }
    else clickCallback = props.callback        

    function browseSuggestions(e) {
        const keysToPrevent = [38, 40] // [upArrow, downArrow]

        if (keysToPrevent.includes(e.keyCode)) {
            e.preventDefault()
            if (suggestions.length <= 0) return;
            
            const input = document.getElementById(`forminput${btnid}`)
            switch(e.keyCode) {

                case keysToPrevent[0]:
                    setIndexSuggestion(
                        (indexSuggestion - 1 === -1)? suggestions.length - 1
                        : indexSuggestion - 1 
                    )
                    input.value = suggestions[indexSuggestion] ?? input.value
                    break;
                
                case keysToPrevent[1]:
                    setIndexSuggestion(
                        (indexSuggestion + 1 === suggestions.length)? 0
                        : indexSuggestion + 1 
                    )
                    input.value = suggestions[indexSuggestion] ?? input.value
                    break;
                
                default: 
                    break;
            }
        }
    }

    function clickOnSuggestion(e, sug) {
        document.getElementById(`forminput${btnid}`).value = sug
        setIndexSuggestion(0)
        setSuggestions([])
    }

    useEffect(() => {
        setIndexSuggestion(0)
    }, [suggestions, btnid])

    return (
        <Box>
        <div className="canvasbutton clickable" id={`btn${btnid}`} onClick={clickCallback}>
            {
                (props.type !== "search")? ""
                : <Box className='suggestions' id={`nodes${btnid}`} sx={{
                        backgroundColor: '#ffffff', 
                        position: 'absolute',
                        display: (suggestions.length > 0)? 'block': 'none',
                        overflowY: 'scroll',
                        width: `${document.getElementById(`forminput${btnid}`)?.clientWidth}px`,
                        maxHeight: '50px',
                        minHeight: '20px',
                        bottom: '40px'
                    }}>
                        <Stack alignItems='flex-start'>
                            {suggestions.map(
                                sug => <Typography className='suggestionItem'
                                    sx={{
                                        cursor: 'pointer',
                                        textOverflow: 'ellipsis',
                                        width: '100%',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        '&:hover': {
                                            backgroundColor: '#9e9e9e'
                                        }
                                    }}
                                    onClick={(e) => clickOnSuggestion(e, sug)}
                                    key={sug}>
                                        {sug}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
            }
            {
                (props.type)? <form autoComplete="off" id={`form${btnid}`} name={`form${btnid}`} style={{display: "none"}} >
                                <input id={`forminput${btnid}`} spellCheck="false" type={props.type} 
                                    onKeyDown={browseSuggestions} onChange={changeCallback} name="input1" 
                                    onClick={(e) => e.target.select()} tabIndex="-1"/>
                                <button tabIndex="-1" className="clickable" onClick={submitCallback}>
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
        </Box>
    )
}