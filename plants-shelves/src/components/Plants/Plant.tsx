import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { PlantType } from './models'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg, Progress, Button, Spinner } from 'reactstrap';
import { WATER_PLANT } from '../queries'
import styles from "./Plant.module.css"
import PlantsDispatch from './PlantsDispatch';
import uiStyles from "./UIElements.module.css"

type PlantProps = {
  plant: PlantType
}

function Plant({ plant }: PlantProps) {
    const dispatch = useContext(PlantsDispatch);
    const [waterPlant, { loading, data, error }] = useMutation(WATER_PLANT, {
      // TODO move to the separate function
      onCompleted: (data: { waterPlant: { plant: PlantType } }) => {
        dispatch && dispatch({ type: 'water', plant: data.waterPlant.plant })
      }
    });
    const toWater = () => waterPlant({variables: { plantId: plant.id } });
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
    if (loading) return  <Spinner color="primary" />

    if (error)  return  <p>Error :( {error.message}</p>;
    return (
      <Card className={styles.plant}>
        <CardBody>
          <Button outline onClick={toWater} className={uiStyles.roundButton}>&#128166;</Button>
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
