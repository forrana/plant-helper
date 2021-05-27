import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { Plant } from './Plant'
import { PlantData } from './models'
import { PlantsCreate } from './PlantsCreate'
import styles from './PlantsList.module.css';

import { Redirect } from "react-router-dom";

function PlantsList() {
    const { loading, data, error } = useQuery<PlantData>(
      GET_ALL_PLANTS,
      // { variables: { year: 2019 } }
    );

    let plants = data ? data.plants : []
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error.message}</p>;
    if (plants.length === 0) return (
      <Redirect push to="/create" />
    )
    return (
      <section className={styles.plants}>
        <h1>Your plants: </h1>
          <section className={styles.plantsList}>
            {
              plants.map((item) => <Plant plant={item} key={item.id} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
