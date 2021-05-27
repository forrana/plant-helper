import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import styles from './App.module.css';
import { PlantsList } from './components/Plants/PlantsList'
import { PlantsCreate } from './components/Plants/PlantsCreate'

function App() {
  return (
    <div className={styles.App}>
      <Switch>
        <Route path="/create">
          <PlantsCreate />
        </Route>
        <Route path="/">
          <PlantsList />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
