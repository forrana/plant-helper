import React from 'react';
import { useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { Button } from 'reactstrap';

import { Plant } from './Plant'
import { PlantData } from './models'
import { PlantsCreate } from './PlantsCreate'
import styles from './PlantsList.module.css';
import uiStyles from "./UIElements.module.css"

import { Redirect } from "react-router-dom";

function PlantsList() {
    const { loading, data, error } = useQuery<PlantData>(
      GET_ALL_PLANTS,
      // { variables: { year: 2019 } }
    );
    const history = useHistory();
    const goToCreatePage = () => history.push("/create");

    let plants = data ? data.plants : []
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error.message}</p>;
    if (plants.length === 0) return (
      <Redirect push to="/create" />
    )
    return (
      <section className={styles.plants}>
          <section className={styles.controls}>
            <Button onClick={goToCreatePage} outline className={uiStyles.roundButton} color="primary" title="Add new plant">
              &#10133;
            </Button>
            <h1>Your plants: </h1>
          </section>
          <section className={styles.plantsList}>
            {
              plants.map((item) => <Plant plant={item} key={item.id} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
