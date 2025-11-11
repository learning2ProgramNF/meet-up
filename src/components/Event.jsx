import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className="event">
      <h2>{event.summary}</h2>
      <p>{event.start.dateTime}</p>
      <p>{event.location}</p>

      {showDetails && (
        <div className="details">
          <h3>About this event:</h3>
          <p>{event.description}</p>
        </div>
      )}

      <button
        className="details-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'hide details' : 'show details'}
      </button>
    </li>
  );
};

export default Event;
