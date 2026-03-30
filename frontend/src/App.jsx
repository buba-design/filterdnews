import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import RushedMode from './components/RushedMode';
import RelaxedMode from './pages/Relaxed';
import './index.css';

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<StartScreen onSelectMode={(m) => navigate(`/${m}`)} />} />
        <Route path="/relaxed" element={<RelaxedMode />} />
        <Route path="/rushed" element={<RushedMode />} />
      </Routes>
    </div>
  );
}

export default App;
