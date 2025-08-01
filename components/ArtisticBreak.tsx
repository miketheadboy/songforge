import React, { useState, useEffect } from 'react';
import { ARTISTIC_BREAK_THEMES } from '../constants';

const ArtisticBreak: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(ARTISTIC_BREAK_THEMES[Math.floor(Math.random() * ARTISTIC_BREAK_THEMES.length)]);
  }, []);

  return (
    <div className="artistic-break">
      <svg className="artistic-break-svg" width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10 C 10 0, 20 20, 30 10 S 50 0, 60 10 S 80 20, 90 10 C 95 5, 98 8, 100 10" stroke="currentColor" strokeWidth="2" fill="transparent" />
      </svg>
      <p className="artistic-break-text">
        {message}
      </p>
      <svg className="artistic-break-svg" width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10 C 10 20, 20 0, 30 10 S 50 20, 60 10 S 80 0, 90 10 C 95 15, 98 12, 100 10" stroke="currentColor" strokeWidth="2" fill="transparent" />
      </svg>
    </div>
  );
};

export default ArtisticBreak;
