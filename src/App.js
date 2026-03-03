import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GoInsideChallenge from './pages/GoInsideChallenge';
import GameChallenge from './pages/GameChallenge';
import IntegralProtocol from './pages/IntegralProtocol';
import IntegralAccessLevel from './pages/IntegralAccessLevel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GoInsideChallenge />} />
          <Route path="/game" element={<GameChallenge />} />
          <Route path="/integral1" element={<IntegralProtocol />} />
          <Route path="/integral2" element={<IntegralAccessLevel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
