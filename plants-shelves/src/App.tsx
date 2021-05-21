import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PlantsList } from './components/Plants/PlantsList'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <PlantsList/>
        </p>
      </header>
    </div>
  );
}

export default App;
