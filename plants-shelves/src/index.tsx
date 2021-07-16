import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import {
  ApolloProvider,
  createHttpLink,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { USER_STATE_STORAGE_KEY } from './components/User/UserReducer';
import { UserState } from './components/User/models';

const graphQLink = createHttpLink({
  uri: "http://localhost:8000/graphql/",
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

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
