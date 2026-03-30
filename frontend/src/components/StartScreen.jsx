import React from 'react';
import Header from './Header';

const StartScreen = ({ onSelectMode }) => {
  return (
    <div className="screen start-screen">
      <Header />
      <div className="start-content">
        <h2>How would you like to see the news today?</h2>
        <div className="button-group">
          <button className="btn btn-green" onClick={() => onSelectMode('relaxed')}>relaxed</button>
          <button className="btn btn-red" onClick={() => onSelectMode('rushed')}>rushed</button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
