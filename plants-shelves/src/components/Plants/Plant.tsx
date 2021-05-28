import React from 'react';
import { PlantType } from './models'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg } from 'reactstrap';
import styles from "./Plant.module.css"

type PlantProps = {
  plant: PlantType
}

function Plant({ plant }: PlantProps) {
    return (
      <Card className={styles.plant}>
        <CardBody>
          <div className={styles.image}>&#129716;</div>
          <CardTitle tag="h5">{plant.name}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{plant.scientificName}</CardSubtitle>
          <CardText>Water in {plant.daysUntilNextWatering} day(s).</CardText>
        </CardBody>
      </Card>
    )
}

export { Plant }
