import React, { useState } from 'react';

import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Button,
    Typography,
} from '@mui/material'

import { Send } from '@mui/icons-material';

export default function BugReportForm(props) {

    const [kind, setKind] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [data, setData] = useState({});

console.log(isValid)

    const bugTypes = {
        "CRASH": "Application Crash",
        "GRAPH": "Problem related to the graph",
        "VISUAL": "Problem related to the Interface (glitch, button not working...)",
        "SUGGESTION": "Submit a suggestion",
        "OTHER": "Something else"
    }

    /*
    | | | | __ _ _ __   __| | | ___ _ __ ___
    | |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
    |  _  | (_| | | | | (_| | |  __/ |  \__ \
    |_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
    */

    function handleKindChange(e) {
        setKind(e.target.value)
        setData({...data, "kind": e.target.value})
    }

    function handleDescriptionChange(e) {
        setData({...data, "description": e.target.value})
    }

    function handleEmailChange(e) {
        setData({...data, "email": e.target.value})
    }

    function handleSubmit(e) {
        console.log(data)
        if (data.kind && data.description) {
            if (!isValid) setIsValid(true)
            console.log("send")
        }
        else {
            setIsValid(false)
        }
    }

    return (
        <FormControl id="rfrform" sx={{ width: "100%"}}>
            <InputLabel id="kind">Kind of bug encountered</InputLabel>
            <Select
                labelId="kind" label="Kind of bug encountered"
                onChange={handleKindChange} 
                value={kind} required    
            >
            {
                Object.keys(bugTypes).map((val) => 
                <MenuItem key={val} value={val}>
                    {bugTypes[val]}
                </MenuItem>)
            }
            </Select>

            <TextField multiline label="Describe what happened" required
                onChange={handleDescriptionChange}
            />

            <TextField label="Your email (optionnal)" onChange={handleEmailChange}/>


            <Typography color="error" variant="body3" sx={{display: (isValid)? "none": "block"}}>
                Invalid inputs!
            </Typography>

            <Button variant="contained" startIcon={<Send sx={{margin: "5px"}}/>}
                onClick={handleSubmit}
            >
                Send report
            </Button>

            

        </FormControl>
        
    )
}