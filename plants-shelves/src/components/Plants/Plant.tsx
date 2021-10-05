import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { PlantData } from './models'
import { Card, CardBody, CardTitle, CardSubtitle, Progress, Button, Spinner, Badge, ButtonGroup,
       } from 'reactstrap';
import { POSTPONE_WATERING, WATER_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch'
import PlantsEdit from './PlantsEdit'
import styles from "./Plant.module.css"
import uiStyles from "../UI/UIElements.module.css"
import ErrorHandler from './ErrorHandler';
import pot from './images/pot.png'
import EditModal from './EditModal';

interface PlantProps extends PlantData { index: number }
interface WhenToWaterProps { daysUntilNextWatering: number }


function WhenToWater({ daysUntilNextWatering }: WhenToWaterProps) {
  if(daysUntilNextWatering === 1)
    return (
      <div className="text-center text-muted"><small className="">Day until watering</small></div>
    )

  if(daysUntilNextWatering < 1)
    return (
      <div className="text-center"><small>Water me!</small></div>
    )

  return (
    <div className="text-center text-muted"><small>Days until watering</small></div>
  )
}

function Plant({ plant, index }: PlantProps) {
    const dispatch = useContext(PlantsDispatch);

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const [isEditModal, setIsEditModal] = useState(false);
    const toggleEditModal = () => setIsEditModal(!isEditModal);

    const [waterPlant, wateringStatus] = useMutation(WATER_PLANT, {
      onCompleted: (data: { waterPlant: PlantData }) => {
        dispatch && dispatch({ type: 'update', plant: data.waterPlant.plant, index: index })
      },
      onError: (e) => console.error('Error creating plant:', e)
    });

    const [postponeWatering] = useMutation(POSTPONE_WATERING, {
      onCompleted: (data: { postponeWatering: PlantData }) => {
        dispatch && dispatch({ type: 'update', plant: data.postponeWatering.plant, index: index })
      },
      onError: (e) => console.error('Error postponing watering plant:', e)
    });


    const toWater = () => waterPlant({variables: { plantId: plant.id } });
    const toPostponeWatering = () => postponeWatering({variables: {plantId: plant.id, postponeDays: 1}})

    const plantHealth = ((plant.daysUntilNextWatering + plant.daysPostpone) / plant.daysBetweenWatering)*100;
    // TODO should be memoized perhaps?
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

    const backgroundColor = () => {
      if( plantHealth >= 70) {
          return "success"
        } else if ( plantHealth >= 50 ) {
          return "info"
        } else if ( plantHealth > 20 ) {
          return "warning"
        } else if ( plantHealth > 5 ) {
          return "danger"
        } else {
          return "alarm"
        }
    }

    const onDragStartEvent = (event: React.DragEvent) => {
      event.currentTarget.classList.add(styles.draggedPlant)
    }

    const onDragEndEvent = (event: React.DragEvent) => {
      event.currentTarget.classList.remove(styles.draggedPlant)
    }


    if (wateringStatus.loading) return  <Spinner color="primary" />

    if (wateringStatus.error) {
      return  <ErrorHandler error={wateringStatus.error} />
    }

    if (isEditMode)
      return (
        <Card className={styles.plant}>
          <Badge color="light">{plant.symbol.userWideId}</Badge>
          <CardBody>
            <PlantsEdit plant={plant} index={index} action={toggleEditMode}/>
          </CardBody>
        </Card>
      )

    return (
      <Card onDragStart={onDragStartEvent} onDragEnd={onDragEndEvent} draggable="true" className={`${styles.plant} ${styles[backgroundColor()]}`} data-testid={`plant-card-${index}`}>
        <Badge color="light" className={styles.badge}>{plant.symbol.userWideId}</Badge>
        <CardBody className={styles.narrowCard}>
          <section className={styles.imageGroup}>
            <WhenToWater daysUntilNextWatering={plant.daysUntilNextWatering}/>
            <ButtonGroup className={styles.progressGroup}>
              <Progress value={ plantHealth } color={ healthColor() } className={styles.progressBar}>{plant.daysUntilNextWatering}</Progress>
              <Button size="sm" color="primary" onClick={toPostponeWatering} title="Postpone Watering">+1</Button>
            </ButtonGroup>
          </section>
          <section className={styles.actions}>
            <Button size="sm" outline onClick={toWater} title="Water" data-testid="water-btn" className={uiStyles.roundButton}>&#128166;</Button>
            <img src={pot} alt="plant pot" className={styles.image}/>
            <Button size="sm" outline onClick={toggleEditModal} title="Edit" data-testid="edit-btn" className={uiStyles.roundButton}>
              <i className="icon icon-settings" />
            </Button>
          </section>
          <CardTitle tag="h5">{plant.name}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{plant.scientificName}</CardSubtitle>
        </CardBody>

        <EditModal isOpen={isEditModal} toggleAction={toggleEditModal} index={index} plant={plant}/>

      </Card>
    )
}

export { Plant }
