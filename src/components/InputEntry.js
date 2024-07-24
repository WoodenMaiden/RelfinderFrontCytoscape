import { useReducer, useRef } from 'react';
import { 
    Box,
    Stack,  
    TextField,
    Button,
    Snackbar,
    Alert,
    Autocomplete
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
                        labelFetchOngoing: action.value !== ""
                    }
                
                case "setSugestions":
                    return {
                        ...state,
                        suggestions: action.value.map(
                            elt => ({ subject: elt.subject.value, label: elt.label?.value })
                        ),
                        error: action.error,
                        labelFetchOngoing: false,
                    }

                case "selectSuggestion": 
                    return { 
                        ...state, 
                        entry: action.value,
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

    function handleInputChange(event, text, reason) {
        const value = text?.trim() ?? ""
        
        if (timeoutIdRef.current)
            clearTimeout(timeoutIdRef.current)

        switch (reason) {
            case "input":
                dispatchState({ type: "setEntry", value })
        
                if (value !== "")
                    timeoutIdRef.current = setTimeout(() => getLabels(value, dispatchState), 2000)

                break;

            case "clear":
                dispatchState({ type: "setEntry", value: "" })
                break;

            case "reset": // that is triggered when selecting a suggestion so we do nothing
                break;

            default: 
                console.error("Unhandled reason", reason)
                break;
        }

        changeHandler(id, value)
    }

    function handleSuggestionSelect(_e, { subject }, reason, _details) { 
        if (reason === "selectOption") {
            dispatchState({
                type: "selectSuggestion",
                value: subject,
            })

            changeHandler(id, subject)
        }
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
                    <br/>
                    This error has been logged to your browser's console.
                </Alert>
            </Snackbar>
            <Stack direction="row" spacing={1}>
                <Autocomplete
                    freeSolo
                    handleHomeEndKeys
                    options={state.suggestions}
                    loading={state.labelFetchOngoing}
                    onInputChange={handleInputChange}
                    value={state.entry}
                    getOptionLabel={_ => state.entry} // to always show what's about to be submitted
                    renderOption={(props, {subject, label}, state ) => (
                        <li {...props}>
                            {label ?? subject ?? ""}
                        </li>
                    )} // to show the label if available but insert the URI anyways
                    noOptionsText='Could not find labels/URIs from submitted text'
                    filterOptions={(x) => x} //to avoid any filtering
                    sx={{
                        flexGrow: 50,
                    }}
                    onChange={handleSuggestionSelect} // to set the uri as the value when selecting a suggestion
                    renderInput={(params) => (<TextField
                        {...params}
                        variant="filled"
                        value={state.entry}
                        placeholder="URI or label"
                        fullWidth
                    />)}
                />                
                <Button onClick={() => rmHandler(id)} variant="outlined" sx={{flexGrow: 1}}>
                    <CloseIcon />
                </Button>
            </Stack>
        </Box>
    )
}