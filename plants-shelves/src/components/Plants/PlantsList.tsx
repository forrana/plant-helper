import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'

interface Plant {
  id: number;
  name: string;
}

interface PlantData {
  plants: Plant[];
}


function PlantsList() {
    const { loading, data, error } = useQuery<PlantData>(
      GET_ALL_PLANTS,
      // { variables: { year: 2019 } }
    );

    let plants = data ? data.plants : []
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error}</p>;
    if (plants.length === 0) return <p> No plants yet. Add your first plant! </p>
    return (
      <div className="shopping-list">
        <h1>Your plants: </h1>
        <ul>
            {plants.map(function(item) {
                return <li>item</li>
            })}
        </ul>
      </div>
    )
}

export { PlantsList }
