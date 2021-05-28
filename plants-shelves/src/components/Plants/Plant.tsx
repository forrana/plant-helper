import React from 'react';
import { useMutation } from '@apollo/client';
import { PlantType } from './models'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg, Progress, Button } from 'reactstrap';
import { WATER_PLANT } from '../queries'
import styles from "./Plant.module.css"

type PlantProps = {
  plant: PlantType
}

function Plant({ plant }: PlantProps) {
    const [waterPlant, { data }] = useMutation(WATER_PLANT);
    const func = () => waterPlant({variables: { plantId: plant.id } });
    const plantHealth = (plant.daysUntilNextWatering / plant.daysBetweenWatering)*100;
    const healthColor = () => {
      if( plantHealth >= 70) {
          return "success"
        } else if ( plantHealth >= 50 ) {
          return "info"
        } else if ( plantHealth > 20 ) {
          return "warning"
        } else {
          return "danger"
        }
    }
    return (
      <Card className={styles.plant}>
        <CardBody>
          <Button onClick={func}>&#128166;</Button>
          <div className={styles.image}>&#129716;</div>
          <CardTitle tag="h5">{plant.name}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{plant.scientificName}</CardSubtitle>
          <div className="text-center">{plant.daysUntilNextWatering} day(s) until watering</div>
          <Progress value={ plantHealth } color={ healthColor() }/>
        </CardBody>
      </Card>
    )
}

export { Plant }
