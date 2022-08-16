import React, { useState } from 'react';

import InputEntry from './InputEntry';

import './inputForm.css'

export default function InputForm(props) {
    const MININPUT = 2
    const [inputArray, setInputArray] = useState([1,2])

    const submit = props.submitCallback


    function add(e) {
        setInputArray(old => [ ...old, inputArray[inputArray.length - 1] + 1])
    }

/*
| | | | __ _ _ __   __| | | ___ _ __ ___
| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
|  _  | (_| | | | | (_| | |  __/ |  \__ \
|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/
    function rm(e) {
        if (inputArray.length <= MININPUT) return;

        const trgt = (!e.target.id) ? e.target.parentNode.id: e.target.id
        const number = parseInt(trgt.match(/(\d+)$/)[1])

        setInputArray(arr => arr.filter(elt => elt !== number))
    }



    return (
        <form id="rfrform" autoComplete="off" onSubmit={submit}>
            <div id="inputs">
                {inputArray.map(item => <InputEntry key={item} input={item} rmHandler={rm}/>)}
            </div>
            <div className="controls">
                <button type="button" onClick={add}>
                    <span className="material-icons-round clickable">
                        add
                    </span>
                </button>
                <button type="reset">
                    <span className="material-icons-round clickable">
                        refresh
                    </span>
                </button>
            </div>

            <button type="submit" className="clickable">
                <h5>Find relations</h5>
                <i className="material-icons-round">
                    hub
                </i>
            </button>
        </form>
    )
}