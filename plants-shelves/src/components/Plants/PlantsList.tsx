import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { PlantsCreate } from './PlantsCreate'

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
    if (error) return <p>Error :( {error.message}</p>;
    if (plants.length === 0) return (
      <div className="new-plant">
        <PlantsCreate/>
      </div>
    )
    return (
      <div className="shopping-list">
        <h1>Your plants: </h1>
        <ul>
            {plants.map(function(item) {
                return <li>{item.name}</li>
            })}
        </ul>
        <div className="new-plant">
          <PlantsCreate/>
        </div>
      </div>
    )
}

export { PlantsList }
