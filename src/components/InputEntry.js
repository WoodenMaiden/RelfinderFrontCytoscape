import { useState } from 'react';
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
        if (entry === "") return;
        
        setSuggestions([]) // to trigger loading animation

        setTimeout(async () => {
            if(e.target.value.trim() === entry) {
                const sugBox = document.getElementById(`suggestions${input}`)
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
                    return new Promise((res) => setTimeout(res(gen), Math.floor(Math.random() * 1500)))
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

    return (
        <>
        <Box id={`suggestions${input}`} sx={{
            backgroundColor: '#ffffff', 
            position: 'absolute',
            display: 'none'
        }}>
            <Stack>
                {(suggestions.length <= 0)
                ? <CircularProgress color='secondary'/>
                : suggestions.map(
                    sug =>  <Typography onClick={() => selectSuggestion(sug)}
                            sx={{cursor: "pointer"}}
                            key={sug.s+sug.label}>
                                {sug.label} - {sug.s}
                            </Typography>
                )}
            </Stack>
        </Box>
        <div className="controls">
            <input type="search" onChange={getLabelsOnEntry} name={input} id={`input${input}`} placeholder="URI or label"/>
            <button className="clickable" type="button" id={`rm${input}`} onClick={rmHandler}>
                <span className="material-icons-round">
                    close
                </span>
            </button>
        </div>
        </>
    )
}