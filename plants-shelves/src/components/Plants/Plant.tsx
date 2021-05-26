import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../queries'
import { PlantsCreate } from './PlantsCreate'
import { PlantType } from './models'
import './Plant.css';

type PlantProps = {
  plant: PlantType
}

function Plant({ plant }: PlantProps) {
    return (
      <article className="plant">
        <b>{plant.name}</b>
        <i>{plant.scientificName}</i>
        <p>Water in {plant.daysUntilNextWatering} day(s)</p>
      </article>
    )
}

export { Plant }
