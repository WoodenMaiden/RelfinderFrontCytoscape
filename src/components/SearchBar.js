import { 
    Stack, 
    Input, 
    Button,
    Box,
    Typography
} from "@mui/material";

import { useState } from "react";


import SearchIcon from '@mui/icons-material/Search';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AdjustIcon from '@mui/icons-material/Adjust';

export default function SearchBar(props) {

    const [ entry, setEntry ] = useState([])
    const [ suggestions, setSuggestions ] = useState([])
    const [ entryConfirmed, setEntryConfirmed ] = useState(false)
    
    const suggestionLogic = props.suggestionLogic
    const confirmEntry = (e) => {
        props.confirmEntry(e)
        setEntryConfirmed(true)
    }

    const resetEntry = () => {
        setEntry("")
        setEntryConfirmed(false)
        props.resetEntry?.apply()
    }

    const onFocusEntity = props.onFocusEntity 

    return (
        <Stack direction="row" spacing={1}>
            <span>
                <Input 
                    sx={{
                        flexGrow: 10,
                        width: "20rem",
                    }} 
                    value={entry}
                    onChange={(e) => {
                        setEntry(e.target.value)
                        setSuggestions(suggestionLogic(e.target.value))
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            confirmEntry(entry)
                        }
                    }}
                />
                <Box
                    sx={{
                        backgroundColor: '#ffffff', 
                        position: 'absolute',
                        display: (suggestions.length > 0)? 'block': 'none',
                        overflowY: 'scroll',
                        width: "20rem",
                        maxHeight: '70px',
                        minHeight: '20px',
                        bottom: '40px'
                    }}
                >
                    <Stack alignItems='flex-start'>
                        {suggestions.map(
                            sug => <Typography className='suggestionItem'
                                sx={{
                                    cursor: 'pointer',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    width: "100%",
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        backgroundColor: '#9e9e9e'
                                    }
                                }}
                                onClick={() => {
                                    setEntry(sug)
                                    setSuggestions([])
                                }}
                                key={sug}>
                                    {sug}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </span>
            
            <Button 
                onClick={() => !entryConfirmed && entry.trim()
                    ? confirmEntry(entry)
                    : resetEntry()
                }
                sx={{flexGrow: 1}} 
                color={entryConfirmed? "warning": "success"}
                variant="contained"
            >
                { !entryConfirmed? <SearchIcon />: <RotateLeftIcon /> } 
            </Button>
            <Button 
                disabled={!entryConfirmed}
                onClick={_ => entry.trim()? onFocusEntity(entry): null}
                sx={{flexGrow: 1}} 
                color="info"
                variant="contained"
            >
                <AdjustIcon/>
            </Button>
        </Stack>
    )
}