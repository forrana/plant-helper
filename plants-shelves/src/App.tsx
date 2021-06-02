import React, { useReducer } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import styles from './App.module.css';
import { PlantsList } from './components/Plants/PlantsList'
import { PlantsCreate } from './components/Plants/PlantsCreate'
import { PlantType } from './components/Plants/models'
import PlantsDispatch from './components/Plants/PlantsDispatch'


const initialState: { plants: PlantType[] } = { plants: [] };

function reducer(state: { plants: PlantType[] }, action: { type: string, plants?: PlantType[], plant?: PlantType }) {
  switch (action.type) {
    case 'add':
      return action.plant && {plants: [...state.plants, action.plant]};
    case 'load':
    // TODO figure out why apollo doesn't return freshly created plant
      if(action.plants && action.plants.length >= state.plants.length)
        return action.plants && {plants: [...action.plants]};
      return state;
    case 'water':
      return { plants: [
        ...state.plants.filter(plant => plant.id !== action.plant?.id),
        action.plant
      ]}
    default:
      throw new Error();
  }
}

function App() {
  // @ts-ignore: figure out why TS2769
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={styles.App}>
      <PlantsDispatch.Provider value={dispatch}>
        <Switch>
          <Route path="/create" component={PlantsCreate}/>
          <Route path="/">
            <PlantsList plants={state.plants} />
          </Route>
        </Switch>
      </PlantsDispatch.Provider>
    </div>
  );
}

export default App;
