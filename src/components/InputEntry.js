import { useState, useEffect } from 'react';
import { 
    Box,
    Stack, 
    Typography, 
    CircularProgress,
} from "@mui/material";

import { URL } from "../variables";

export default function InputEntry(props) {
    const rmHandler =  props.rmHandler
    const input = props.input

    const [ timeoutID, setTimeoutID ] = useState(setTimeout(()=> { return true;}, 0))
    const [ suggestions, setSuggestions ] = useState([])
    const [ entry, setEntry ] = useState("")


    // returns the timeout id in order to clear it with setTimeout()
    function getLabelsOnEntry() {

        //TODO pass aborter to function in timeout
        return setTimeout(async () => {
            const sugBox = document.getElementById(`suggestions${input}`)
            setSuggestions([]) // to trigger loading animation
            sugBox.style.display = 'block'

            // mocking this for now because virtuoso takes ~ 4 min to execute /labels for some reason
                
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "node": entry
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const fetchLabels = await (await fetch(`${URL}/labels`, requestOptions)).json()

            setSuggestions([ ...fetchLabels.labels.map(
                (elt) => { return { s: elt.s.value, label: elt.label?.value }}
            )])
        }, 2000)
    }


/*
     _   _                 _ _
	| | | | __ _ _ __   __| | | ___ _ __ ___
	| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
	|  _  | (_| | | | | (_| | |  __/ |  \__ \
	|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

    function selectSuggestion(sug) {
        const sugBox = document.getElementById(`suggestions${input}`)

        sugBox.style.display = 'none'
        setSuggestions([])
        setEntry(sug.s)
    }

    function click(e) {
        if (
            typeof e.target.className === "string" // if you click on a svg, they have not a "string" type
            && !e.target.className.includes('suggestionItem') 
            ){ 

            document.getElementById(`suggestions${input}`).style.display = 'none' 
            setSuggestions([]);
        }
    }

    function entryChanges(e) {
        setEntry(e.target?.value)
    }


/*
     _   _             _ 
    | | | | ___   ___ | | _ ___
    | |_| |/ _ \ / _ \| |/ / __|
    |  _  | (_) | (_) |   <\__ \
    |_| |_|\___/ \___/|_|\_\___/
*/

    useEffect(() => {
        clearTimeout(timeoutID)

        if (entry.trim() === "") {
            document.getElementById(`suggestions${input}`).style.display = 'none'
            setSuggestions([])
        } else {
            setTimeoutID(getLabelsOnEntry())
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry, input])

    useEffect(() => {
        document.addEventListener('click', click, true)
        return () => document.removeEventListener('click', click, true);
    })

    return (
        <Box>
            <div className="controls">
                <input type="search" onChange={entryChanges} value={entry} name={input} id={`input${input}`} placeholder="URI or label"/>
                <button className="clickable" type="button" id={`rm${input}`} onClick={rmHandler}>
                    <span className="material-icons-round">
                        close
                    </span>
                </button>
            </div>
            <Box className='suggestions' id={`suggestions${input}`} sx={{
                backgroundColor: '#ffffff', 
                position: 'absolute',
                display: 'none',
                overflowY: 'scroll',
                maxHeight: '80px',
                minHeight: '10px',
            }}>
                <Stack alignItems={(suggestions.length <= 0)? 'center': 'flex-start' } >
                    {(suggestions.length <= 0)
                    ? <CircularProgress color='secondary'/>
                    : suggestions.map(
                        sug =>  <Typography className='suggestionItem' onClick={() => selectSuggestion(sug)}
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
                            key={sug.s+sug.label}>
                                {(sug.label)? `${sug.label} - ${sug.s}`: sug.s }
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}