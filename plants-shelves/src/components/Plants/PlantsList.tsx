import React from 'react';
import { useHistory } from "react-router-dom";
import { Button } from 'reactstrap';

import { Plant } from './Plant'
import { PlantsData } from './models'
import styles from './PlantsList.module.css';
import uiStyles from "./UIElements.module.css"

interface PlantsListProps extends PlantsData {}

function PlantsList(props: PlantsListProps) {
    const history = useHistory();
    const goToCreatePage = () => history.push("/create");

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
              props.plants.map((item, index) => <Plant plant={item} index={index} key={index} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
