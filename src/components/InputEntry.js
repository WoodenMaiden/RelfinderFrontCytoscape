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

    const [ suggestions, setSuggestions ] = useState([])

    async function getLabelsOnEntry(e) {
        const entry = e.target.value.trim()
        if (entry === "") {
            document.getElementById(`suggestions${input}`).style.display = 'none'
            setSuggestions([])
            return;
        }

        setTimeout(async () => {
            if(e.target.value.trim() === entry) {
                
                const sugBox = document.getElementById(`suggestions${input}`)
                setSuggestions([]) // to trigger loading animation
                sugBox.style.display = 'block'

                // mocking this for now because virtuoso takes ~ 4 min to execute /labels for some reason
                
                // const myHeaders = new Headers();
				// myHeaders.append("Content-Type", "application/json");
	
				// const raw = JSON.stringify({
				// 	"node": entry
				// });
	
				// const requestOptions = {
				// 	method: "POST",
				// 	headers: myHeaders,
				// 	body: raw,
				// 	redirect: "follow"
				// };
                // const labels = await fetch(`${URL}/labels`, requestOptions) 
                function mockData(node) {
                    return new Promise((res, rej) => setTimeout(() => {
                        const allowed='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/_-'                    
                        const gen = []
                        for(let i = 0; i < Math.floor(Math.random() * 15); ++i ) {
                            let subject = node
                            let lbl = ''
                            for (let c = 0; c < 5; ++c ) {
                                subject += allowed.charAt(Math.floor(Math.random() * allowed.length));
                                lbl += allowed.charAt(Math.floor(Math.random() * allowed.length - 3))
                            }

                            gen.push({
                                s: subject,
                                label: lbl
                            })
                        }
                        res(gen)
                    }, Math.floor(Math.random() * 1500)))
                }

                const labels = await mockData(entry)
                setSuggestions([ ...labels ])
            }
        }, 2000)
    }

    function selectSuggestion(sug) {
        const sugBox = document.getElementById(`suggestions${input}`)
        const forminput = document.getElementById(`input${input}`)

        sugBox.style.display = 'none'
        setSuggestions([])
        forminput.value = sug.s
    }

    function click(e) {
        if (
            typeof e.target.className === "string" // if you click on a svg, they have not a "string" type
            && !e.target.className.includes('suggestionItem') 
            && suggestions.length > 0){ 

            document.getElementById(`suggestions${input}`).style.display = 'none' 
            setSuggestions([]);
        }
    }

    useEffect(() => {
        document.addEventListener('click', click, true)
        return () => document.removeEventListener('click', click, true);
    })

    return (
        <Box>
            <div className="controls">
                <input type="search" onChange={getLabelsOnEntry} name={input} id={`input${input}`} placeholder="URI or label"/>
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
                                {sug.label} - {sug.s}
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}