import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initialGame } from '../constants';

function GameEnd() {
  const navigate = useNavigate();
  const location = useLocation();

  const game = location.state ? location.state.game : initialGame;
  const { score } = game;

  const handleStartClick = () => {
    navigate('/play');
  };

  return (
    <div>
      <h1>Game Over</h1>
      <p>
        Score:
        {score}
      </p>
      <p>Thanks for playing!</p>

      <button type="button" onClick={handleStartClick}>Play Again</button>
    </div>
  );
}

export default GameEnd;
