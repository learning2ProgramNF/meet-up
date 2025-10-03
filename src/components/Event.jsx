// src/compononents/EventList.jsx
import React, { useState } from 'react';


const Event = ({ event }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);


    return (
        <li>
            <h2>{event.summary}</h2>
            <p>{event.created}</p>
            <p>{event.location}</p>
            <button onClick={toggleDetails}>show details</button>
            {showDetails && <p>{event.description}</p>}
        </li>
    );
}


export default Event;