import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';

const GET_CITY_BY_NAME = gql`
  query {
    plants {
      id, name
    }
  }
`;


function App() {
  const { loading, error, data } = useQuery(GET_CITY_BY_NAME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          plants total: {data.plants.length}
        </p>
      </header>
    </div>
  );
}

export default App;
