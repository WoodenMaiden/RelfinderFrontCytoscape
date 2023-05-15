import React, { useState } from 'react';
import { Stack, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

import InputEntry from './InputEntry';
import { v4 } from "uuid";

import './inputForm.css'

export default function InputForm(props) {
    const MININPUT = 2
    const [inputArray, setInputArray] = useState([{
        id: v4(),
        entry: "",
    },{
        id: v4(),
        entry: "",
    }])

    const submit = props.submitCallback
    const inputChange = props.changeInputsCallback

    const clearEvent = new class ClearEvent extends EventTarget {
        clearFields() {
          this.dispatchEvent(new Event("clear"));
        }
    }()


/*
| | | | __ _ _ __   __| | | ___ _ __ ___
| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
|  _  | (_| | | | | (_| | |  __/ |  \__ \
|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

    function rm(idToRm) {
        if (inputArray.length <= MININPUT) return;

        const newInputs = inputArray.filter(elt => elt.id !== idToRm)

        setInputArray(newInputs)
        inputChange(newInputs.map(elt => elt.entry))
    }

    function add() {
        const newInputs = [...inputArray, {
            id: v4(),
            entry: "",
        }]
        setInputArray(newInputs)
        inputChange(newInputs.map(elt => elt.entry))
    }

    function change(id, value) {
        const newInputs = inputArray.map(elt => {
            if (elt.id === id) {
                return { ...elt, entry: value }
            }
            return elt
        })
        setInputArray(newInputs)
        inputChange(newInputs.map(elt => elt.entry))
    }


    return (
        <form id="rfrform" autoComplete="off" onSubmit={submit}>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    {inputArray.map(item =>
                        <InputEntry
                            key={item.id}
                            id={item.id}
                            clearEvent={clearEvent}
                            rmHandler={rm}
                            changeHandler={change}
                        />
                    )}
                </Stack>
                <Stack direction="row" alignItems="stretch" gap="5px">
                    <Button onClick={add} variant="contained" fullWidth>
                        <AddIcon />
                    </Button>
                    <Button
                        variant="contained"
                        type="reset"
                        onClick={() => clearEvent.clearFields()}
                        fullWidth
                    >
                        <RotateLeftIcon />
                    </Button>
                </Stack>
                <Button startIcon={<DeviceHubIcon/>} variant="contained" type="submit" fullWidth>
                    Find relations
                </Button>
            </Stack>
        </form>
    )
}