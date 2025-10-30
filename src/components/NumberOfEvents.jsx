// src/components/NumberOfEvents.jsx

import React, { useState } from 'react';


const NumberOfEvents = ({ setCurrentNOE }) => {
    const [number, setNumber] = useState(32);

    const handleInputChanged = (e) => {
        const value = e.target.value;
        setNumber(value);
        setCurrentNOE(value);
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
