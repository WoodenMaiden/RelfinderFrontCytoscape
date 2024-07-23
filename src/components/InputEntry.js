import { useReducer, useRef } from 'react';
import { 
    Box,
    Stack, 
    Typography, 
    TextField,
    Button,
    Snackbar,
    CircularProgress,
    Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { URL } from "../variables";

export default function InputEntry(props) {
    const rmHandler =  props.rmHandler
    const changeHandler = props.changeHandler
    const id = props.id

    const timeoutIdRef = useRef(null);

    const [state, dispatchState ] = useReducer( 
        (state, action) => {
            switch(action.type) {
                case "setEntry":
                    return { 
                        ...state, 
                        entry: action.value,
                        labelFetchOngoing: true
                    }
                
                case "setSugestions":
                    return {
                        ...state,
                        suggestions: action.value.map(
                            elt => ({ subject: elt.subject.value, label: elt.label?.value })
                        ),
                        error: `${action.error},\n\nThis error has been logged to your browser's console`,
                        labelFetchOngoing: false,
                    }

                case "selectSuggestion": 
                    return { 
                        ...state, 
                        entry: action.value,
                        labelFetchOngoing: false,
                        suggestions: []
                    }

                case "discardSnackbar":
                    return { ...state, error: null }
            
                default:
                    return { ...state, error: `Unknown action type ${action.type}`}
            }
        } , {
            entry: "",
            labelFetchOngoing: false,
            suggestions: [],
            error: null,
        }
    )


    async function getLabels(inputText, dispatchCallback) {
        let error = null
        let value = []

        try {
            const fetchLabels = await fetch(`${URL}/labels`, {
                method: "POST",
                headers: new Headers({ "Content-Type": "application/json" }),
                body: JSON.stringify({
                    "node": inputText
                }),
                redirect: "follow",
            })

            value = await fetchLabels.json()
                
        } catch (exception) {
            error = "Failed to get labels and URIs: " + JSON.stringify(exception)
            console.error(error)
        }

        dispatchCallback({ type: "setSugestions", value, error })
    }

/*
     _   _                 _ _
	| | | | __ _ _ __   __| | | ___ _ __ ___
	| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
	|  _  | (_| | | | | (_| | |  __/ |  \__ \
	|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

    function handleInputChange(event) {
        const value = event.target.value.trim()
        
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current)
        }
        
        dispatchState({
            type: "setEntry",
            value
        })

        if (value !== "") {
            timeoutIdRef.current = setTimeout(() => getLabels(value, dispatchState), 2000)

            changeHandler(id, value)
        }
    }

    function handleSuggestionClick({ subject }) {
        dispatchState({
            type: "selectSuggestion",
            value: subject,
        })

        changeHandler(id, subject)
    }

    function handleCloseSnackbar() {
        dispatchState({ type: "discardSnackbar" })
    }

    return (
        <Box>
            <Snackbar 
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={state.error && !state.labelFetchOngoing}
                autoHideDuration={10000}
                message={state.error}
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    severity="error" 
                    variant="filled" 
                    onClose={handleCloseSnackbar} 
                    sx={{ 
                        width: '100%' 
                    }}
                >
                    {state.error}
                </Alert>
            </Snackbar>
            <Stack direction="row" spacing={1}>
                <TextField
                    variant="filled"
                    onChange={handleInputChange}
                    value={state.entry}
                    placeholder="URI or label"
                    fullWidth
                    style={{
                        flexGrow: 8,
                    }}
                />
                <Button onClick={() => rmHandler(id)} variant="outlined" sx={{flexGrow: 1}}>
                    <CloseIcon />
                </Button>
            </Stack>
            <Box id={`suggestions${id}`} sx={{
                zIndex: 99999,
                backgroundColor: '#ffffff', 
                position: 'absolute',
                overflowY: 'scroll',
                maxHeight: '80px',
                minHeight: '10px',
            }}>
                <Stack alignItems={(state.suggestions.length <= 0)? 'center': 'flex-start' } >
                    {
                    state.labelFetchOngoing
                        ? <CircularProgress color='secondary'/>
                        : state.suggestions.map(
                            sug =>  <Typography className='suggestionItem' onClick={() => handleSuggestionClick(sug)}
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
                                key={sug.subject+sug.label}>
                                    {(sug.label)? `${sug.label} - ${sug.subject}`: sug.subject }
                            </Typography>
                        )
                    }
                </Stack>
            </Box>
        </Box>
    )
}