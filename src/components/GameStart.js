import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameStart() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/play');
  };

  return (
    <div>
      <h1>Game Start</h1>
      <button type="button" onClick={handleStartClick}>Start</button>
    </div>
  );
}

export default GameStart;
