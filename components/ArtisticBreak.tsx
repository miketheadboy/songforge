import React, { useState, useEffect } from 'react';
import { ARTISTIC_BREAK_THEMES } from '../constants'; // Import the new constant

const ArtisticBreak: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Use the new ARTISTIC_BREAK_THEMES constant
    setMessage(ARTISTIC_BREAK_THEMES[Math.floor(Math.random() * ARTISTIC_BREAK_THEMES.length)]);
  }, []);

  return (
    <div className="artistic-break-placeholder"> {/* Styles defined in global index.html */}
      <p>
        {message}
      </p>
    </div>
  );
};

export default ArtisticBreak;
