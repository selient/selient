import React from 'react';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';

import GameStart from './components/GameStart';
import GamePlay from './components/GamePlay';
import GameEnd from './components/GameEnd';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameStart />} />
        <Route path="play" element={<GamePlay />} />
        <Route path="end" element={<GameEnd />} />
      </Routes>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
