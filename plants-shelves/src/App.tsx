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
import { REFRESH_TOKEN } from './components/User/queries';
import AlertDispatch from './components/UI/AlertDispatch';
import { AlertReducerAction, AlertState } from './components/UI/models';
import { alertReducer, initialAlertState } from './components/UI/AlertReducer';
import AlertContext from './components/UI/AlertContext';
import AlertManager from './components/UI/AlertManager';
import UserPasswordResetEmail from './components/User/UserPasswordResetEmail';
import UserPasswordReset from './components/User/UserPasswordReset';


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

const isRefreshNeeded = (expAt: number) => {
  if (Date.now() >= expAt * 1000) {
    return true
  }
  return false;
}

const refreshAuthToken = async () => {
  let userState: UserState  = getInitialState()
  let refreshToken = userState.refreshToken;

  if (refreshToken) {
    const newToken = await client
    .mutate({
      mutation: REFRESH_TOKEN,
      variables: { refreshToken },
    })
    .then(res => {
      const newToken = res.data?.refreshToken?.token;
      const newRefreshToken = res.data?.refreshToken?.refreshToken;
      const expAt = res.data?.refreshToken?.payload?.exp || Date();
      localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify({...userState, token: newToken, refreshToken: newRefreshToken, expAt}));
      return newToken;
    });

  return newToken;
  }
};


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

const authLink = setContext(async (request, { headers }) => {
  if (request.operationName !== 'RefreshToken') {
    let userState: UserState  = getInitialState()

    let token = userState.token;

    const shouldRefresh = isRefreshNeeded(userState.expAt);

    if (token && shouldRefresh) {
      const refreshPromise = await refreshAuthToken();

      token = await refreshPromise;
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
  }

  return { headers };
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
  const [alertState, alertDispatch]:[AlertState, Dispatch<AlertReducerAction>] = useReducer(alertReducer, initialAlertState);

  useEffect(() => {
    localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(userState));
  }, [userState]);

  return (
    <ApolloProvider client={client}>
      <UserDispatch.Provider value={userDispatch}>
        <UserContext.Provider value={userState}>
          <PlantsDispatch.Provider value={dispatch}>
            <AlertDispatch.Provider value={alertDispatch}>
              <AlertContext.Provider value={alertState}>
                <ServiceWorkerWrapper />
                <AlertManager />
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
                  <PublicRoute path="/password-reset-email">
                    <UserPasswordResetEmail />
                  </PublicRoute>
                  <PublicRoute path="/password-reset">
                    <UserPasswordReset />
                  </PublicRoute>
                  <PrivateRoute path="/">
                    <PlantsContainer state={state}/>
                  </PrivateRoute>
                </Switch>
              </AlertContext.Provider>
            </AlertDispatch.Provider>
          </PlantsDispatch.Provider>
        </UserContext.Provider>
      </UserDispatch.Provider>
    </ApolloProvider>
  );
}

export default App;
