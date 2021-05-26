import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { Plant } from './Plant'
import { PlantData } from './models'
import { PlantsCreate } from './PlantsCreate'
import './PlantsList.css';

function PlantsList() {
    const { loading, data, error } = useQuery<PlantData>(
      GET_ALL_PLANTS,
      // { variables: { year: 2019 } }
    );

    let plants = data ? data.plants : []
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error.message}</p>;
    if (plants.length === 0) return (
      <section className="new-plant">
        <PlantsCreate/>
      </section>
    )
    return (
      <section className="plants">
        <h1>Your plants: </h1>
          <section className="plants-list">
            {
              plants.map((item) => <Plant plant={item} key={item.id} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
