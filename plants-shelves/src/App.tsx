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
import ServiceWorkerWrapper from './ServiceWorkerWrapper';


const host = window.location.hostname
const protocol = window.location.protocol
const DEV_URL = `${protocol}//${host}:8000/graphql/`
const PROD_URL = `${protocol}//${host}/api/graphql/`

let graphQLURL: () => string = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return DEV_URL
  } else {
    return PROD_URL
  }
}

const graphQLink = createHttpLink({
  uri: graphQLURL(),
});

const cache = new InMemoryCache();
// Copy pasted from https://docs.djangoproject.com/en/3.2/ref/csrf/
const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const userStateStr:string|null = localStorage.getItem(USER_STATE_STORAGE_KEY);
  let token = null;
  if(userStateStr !== null) {
    const userState: UserState = JSON.parse(userStateStr);
    token = userState.token;
  }
    // return the headers to the context so httpLink can read them
  const csrftoken = getCookie('csrftoken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : "",
      "X-CSRFToken": csrftoken || "",
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
            <ServiceWorkerWrapper />
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
