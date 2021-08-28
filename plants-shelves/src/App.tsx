import React, { useReducer, Dispatch, useEffect } from 'react';
import {
  Switch
} from "react-router-dom";
import PlantsContainer from './components/Plants/PlantsContainer'

import { GlobalReducerAction, GlobalState } from './components/Plants/models'
import { globalReducer, initialGlobalState } from './components/Plants/GlobalReducer'
import PlantsDispatch from './components/Plants/PlantsDispatch'

import { UserReducerAction, UserState } from './components/User/models'
import { userReducer, getInitialState, USER_STATE_STORAGE_KEY } from './components/User/UserReducer'
import UserContext from './components/User/UserContext'
import UserDispatch from './components/User/UserDispatch'
import Login from './components/User/Login';
import Logout from './components/User/Logout';
import Signup from './components/User/Signup';
import { PrivateRoute, PublicRoute } from './components/Auth/AuthRoutes';

import {
  ApolloProvider,
  createHttpLink,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';


const host = window.location.hostname
const protocol = window.location.protocol

const graphQLink = createHttpLink({
  uri: `${protocol}//${host}/api/`,
});

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const userStateStr:string|null = localStorage.getItem(USER_STATE_STORAGE_KEY);
  let token = null;
  if(userStateStr !== null) {
    const userState: UserState = JSON.parse(userStateStr);
    token = userState.token;
  }
    // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(graphQLink),
  cache,
  credentials: "include",
  resolvers: {},
});

function App() {
  const [state, dispatch]:[GlobalState, Dispatch<GlobalReducerAction>] = useReducer(globalReducer, initialGlobalState);
  const [userState, userDispatch]:[UserState, Dispatch<UserReducerAction>] = useReducer(userReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(userState));
  }, [userState]);

  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}

export default App;
