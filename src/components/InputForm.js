import React, { useState } from 'react';
import ReactDOM  from 'react-dom';

import InputEntry from './InputEntry';

import './inputForm.css'

export default function InputForm(props) {
    const MININPUT = 2
    const [inputArray, setInputArray] = useState([1,2])

    function rm(e) {
        console.log(e)
        if (inputArray.length <= MININPUT) return;
        //TODO
    }

    function add(e) {
        setInputArray(old => [ ...old, inputArray[inputArray.length - 1] + 1])
        console.log(inputArray)
    }

    return (
        <form id="rfrform">
            <div id="inputs">
                {inputArray.map(item => <InputEntry key={item} input={item} rmHandler={rm}/>)}
            </div>
            <div className="controls">
                <button type="button" onClick={add}>
                    <span className="material-icons-round">
                        add
                    </span>
                </button>
                <button type="reset">
                    <span className="material-icons-round">
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