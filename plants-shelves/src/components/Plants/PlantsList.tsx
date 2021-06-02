import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { Button } from 'reactstrap';

import { Plant } from './Plant'
import { PlantData, PlantType } from './models'
import { PlantsCreate } from './PlantsCreate'
import styles from './PlantsList.module.css';
import uiStyles from "./UIElements.module.css"
import PlantsDispatch from './PlantsDispatch';


import { Redirect } from "react-router-dom";

type PlantsListProps = {
  plants: PlantType[],
}

function PlantsList(props: PlantsListProps) {
    const dispatch = useContext(PlantsDispatch);

    const { loading, data, error } = useQuery<PlantData>(
      GET_ALL_PLANTS,
      {
        onCompleted: (data: PlantData) => {
          dispatch && dispatch({ type: 'load', plants: data.plants })
        }
      }
    );
    const history = useHistory();
    const goToCreatePage = () => history.push("/create");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error.message}</p>;

    if (props.plants.length === 0) return (
      <p> No plants yet, create the first one </p>
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
              props.plants.map((item) => <Plant plant={item} key={item.id} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
