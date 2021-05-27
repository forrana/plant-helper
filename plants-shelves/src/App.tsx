import React from 'react';
import styles from './App.module.css';
import { PlantsList } from './components/Plants/PlantsList'

function App() {
  return (
    <div className={styles.App}>
      <PlantsList/>
    </div>
  );
}

export default App;
