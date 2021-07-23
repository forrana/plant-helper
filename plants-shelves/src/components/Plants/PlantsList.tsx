import React from 'react';

import { Plant } from './Plant'
import { PlantsData } from './models'
import styles from './PlantsList.module.css';

interface PlantsListProps extends PlantsData {}

const PlantsList: React.FC<PlantsListProps> = (props) => {
    return (
      <section className={styles.plants}>
          <section className={styles.plantsList} data-test="plant-list-container">
            {
              props.plants.map((item, index) => <Plant plant={item} index={index} key={index} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
