import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PlantsList } from './components/Plants/PlantsList'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PlantsList/>
      </header>
    </div>
  );
}

export default App;
