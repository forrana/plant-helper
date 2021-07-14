import React, { useReducer, Dispatch, createContext } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import PlantsContainer from './components/Plants/PlantsContainer'
import styles from './App.module.css';
import { PlantsCreate } from './components/Plants/PlantsCreate'

import { GlobalReducerAction, GlobalState } from './components/Plants/models'
import { globalReducer, initialGlobalState } from './components/Plants/GlobalReducer'
import PlantsDispatch from './components/Plants/PlantsDispatch'

import { UserReducerAction, UserState } from './components/User/models'
import { userReducer, initialUserState } from './components/User/UserReducer'
import UserContext from './components/User/UserContext'
import UserDispatch from './components/User/UserDispatch'
import Login from './components/User/Login';
import Signup from './components/User/Signup';

function App() {
  const [state, dispatch]:[GlobalState, Dispatch<GlobalReducerAction>] = useReducer(globalReducer, initialGlobalState);
  const [userState, userDispatch]:[UserState, Dispatch<UserReducerAction>] = useReducer(userReducer, initialUserState);

  return (
    <div className={styles.App}>
      <UserDispatch.Provider value={userDispatch}>
        <UserContext.Provider value={userState}>
          <PlantsDispatch.Provider value={dispatch}>
            <Switch>
              <Route path="/create" component={PlantsCreate}/>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/signup">
                <Signup/>
              </Route>
              <Route path="/">
                <PlantsContainer state={state}/>
              </Route>
            </Switch>
          </PlantsDispatch.Provider>
        </UserContext.Provider>
      </UserDispatch.Provider>
    </div>
  );
}

export default App;
