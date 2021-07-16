import { useReducer, Dispatch } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import PlantsContainer from './components/Plants/PlantsContainer'

import { GlobalReducerAction, GlobalState } from './components/Plants/models'
import { globalReducer, initialGlobalState } from './components/Plants/GlobalReducer'
import PlantsDispatch from './components/Plants/PlantsDispatch'

import { UserReducerAction, UserState } from './components/User/models'
import { userReducer, initialUserState } from './components/User/UserReducer'
import UserContext from './components/User/UserContext'
import UserDispatch from './components/User/UserDispatch'
import Login from './components/User/Login';
import Logout from './components/User/Logout';
import Signup from './components/User/Signup';
import { PrivateRoute } from './components/Auth/PrivateRoute';

function App() {
  const [state, dispatch]:[GlobalState, Dispatch<GlobalReducerAction>] = useReducer(globalReducer, initialGlobalState);
  const [userState, userDispatch]:[UserState, Dispatch<UserReducerAction>] = useReducer(userReducer, initialUserState);

  return (
    <div>
      <UserDispatch.Provider value={userDispatch}>
        <UserContext.Provider value={userState}>
          <PlantsDispatch.Provider value={dispatch}>
            <Switch>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/logout">
                <Logout/>
              </Route>
              <Route path="/signup">
                <Signup/>
              </Route>
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
