import React, { useReducer, Dispatch, useEffect } from 'react';
import {
  Switch
} from "react-router-dom";
import PlantsContainer from './components/Plants/PlantsContainer'

import { GlobalReducerAction, GlobalState } from './components/Plants/models'
import { globalReducer, initialGlobalState } from './components/Plants/GlobalReducer'
import PlantsDispatch from './components/Plants/PlantsDispatch'

import { UserReducerAction, UserState } from './components/User/models'
import { userReducer, initialUserState, USER_STATE_STORAGE_KEY } from './components/User/UserReducer'
import UserContext from './components/User/UserContext'
import UserDispatch from './components/User/UserDispatch'
import Login from './components/User/Login';
import Logout from './components/User/Logout';
import Signup from './components/User/Signup';
import { PrivateRoute, PublicRoute } from './components/Auth/AuthRoutes';

function App() {
  const [state, dispatch]:[GlobalState, Dispatch<GlobalReducerAction>] = useReducer(globalReducer, initialGlobalState);
  const [userState, userDispatch]:[UserState, Dispatch<UserReducerAction>] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(userState));
  }, [userState]);

  return (
    <div>
      <UserDispatch.Provider value={userDispatch}>
        <UserContext.Provider value={userState}>
          <PlantsDispatch.Provider value={dispatch}>
            <Switch>
              <PublicRoute path="/login">
                <Login/>
              </PublicRoute>
              <PrivateRoute path="/logout">
                <Logout/>
              </PrivateRoute>
              <PublicRoute path="/signup">
                <Signup/>
              </PublicRoute>
              <PrivateRoute path="/">
                <PlantsContainer state={state}/>
              </PrivateRoute>
            </Switch>
          </PlantsDispatch.Provider>
        </UserContext.Provider>
      </UserDispatch.Provider>
    </div>
  );
}

export default App;
