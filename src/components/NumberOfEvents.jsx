// src/components/NumberOfEvents.jsx

import React, { useState } from 'react';

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert }) => {
    const [number, setNumber] = useState(32);

    const handleInputChanged = (e) => {
        const value = e.target.value;
        setNumber(value);
        
        if (isNaN(value) || value <= 0) {
            setErrorAlert("Only positive numbers are allowed");
        } else {
            setErrorAlert("");
            setCurrentNOE(value);
        }
    };

    return (
        <div id='number-of-events'>
            <input
                type='text'
                role='textbox'
                value={number}
                onChange={handleInputChanged}
            />
        </div>
    );
};

export default NumberOfEvents;