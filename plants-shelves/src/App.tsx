import React, { useReducer, Dispatch } from 'react';
import { useHistory } from "react-router-dom";
import {
  Switch,
  Route
} from "react-router-dom";
import { useQuery } from '@apollo/client';
import { Button } from 'reactstrap';

import styles from './App.module.css';
import { PlantsList } from './components/Plants/PlantsList'
import { PlantsCreate } from './components/Plants/PlantsCreate'
import { GlobalReducerAction, GlobalState } from './components/Plants/models'
import PlantsDispatch from './components/Plants/PlantsDispatch'
import { PlantsData } from './components/Plants/models'

import { GET_ALL_PLANTS } from './components/queries'

const initialState: GlobalState  = { plants: [] };

function reducer(state: GlobalState, action: GlobalReducerAction) {
  switch (action.type) {
    case 'add':
      return { plants: [...state.plants, action.plant] };
    case 'load':
      return { plants: [...action.plants] };
    case 'water':
      return { plants: [
        ...state.plants.filter(plant => plant.id !== action.plant.id),
        action.plant
      ]}
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch]:[GlobalState, Dispatch<GlobalReducerAction>] = useReducer(reducer, initialState);

  const { loading, data, error } = useQuery<PlantsData>(
    GET_ALL_PLANTS,
    {
      onCompleted: (data: PlantsData) => {
        dispatch({ type: 'load', plants: data.plants })
      }
    }
  );

  const history = useHistory();
  const goToCreatePage = () => history.push("/create");


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  if (data?.plants?.length === 0) return (
    <section>
      <p> No plants yet, create the first one! </p>
      <Button onClick={goToCreatePage} outline color="primary" title="Add new plant">
        Create!
      </Button>
    </section>
  )

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
