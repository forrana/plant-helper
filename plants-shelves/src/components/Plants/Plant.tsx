import React from 'react';
import { PlantType } from './models'
import styles from './Plant.module.css';

type PlantProps = {
  plant: PlantType
}

function Plant({ plant }: PlantProps) {
    return (
      <article className={styles.plant}>
        <b>{plant.name}</b>
        <i>{plant.scientificName}</i>
        <p>Water in {plant.daysUntilNextWatering} day(s)</p>
      </article>
    )
}

export { Plant }
