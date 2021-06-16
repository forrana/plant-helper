import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { PlantData } from './models'
import { Card, CardBody, CardTitle, CardSubtitle, Progress, Button, Spinner,
         Modal, ModalHeader, ModalBody, ModalFooter,
        } from 'reactstrap';
import { WATER_PLANT, DELETE_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch'
import PlantsEdit from './PlantsEdit'
import styles from "./Plant.module.css"
import uiStyles from "../UI/UIElements.module.css"

interface PlantProps extends PlantData { index: number }
interface WhenToWaterProps { daysUntilNextWatering: number }


function WhenToWater({ daysUntilNextWatering }: WhenToWaterProps) {
  if(daysUntilNextWatering > 1)
    return (
      <div className="text-center">{daysUntilNextWatering} days until watering</div>
    )

  if(daysUntilNextWatering == 1)
    return (
      <div className="text-center">Water in {daysUntilNextWatering} day</div>
    )

  if(daysUntilNextWatering < 1)
    return (
      <div className="text-center">Water me!</div>
    )

  return (
    <div className="text-center">Uups! Something went wrong!</div>
  )
}

function Plant({ plant, index }: PlantProps) {
    const dispatch = useContext(PlantsDispatch);

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    const [waterPlant, wateringStatus] = useMutation(WATER_PLANT, {
      onCompleted: (data: { waterPlant: PlantData }) => {
        dispatch && dispatch({ type: 'update', plant: data.waterPlant.plant, index: index })
      }
    });
    const toWater = () => waterPlant({variables: { plantId: plant.id } });
    const plantHealth = (plant.daysUntilNextWatering / plant.daysBetweenWatering)*100;
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

    const [deletePlant, deletingStatus] = useMutation(DELETE_PLANT, {
      onCompleted: () => {
        dispatch && dispatch({ type: 'delete', index: index })
      }
    });
    const confirmDeletion = () => {
      deletePlant({variables: { plantId: plant.id } });
      toggleModal()
    }

    if (wateringStatus.loading || deletingStatus.loading) return  <Spinner color="primary" />

    if (wateringStatus.error)  return  <p> Watering error :( {wateringStatus.error} </p>;
    if (deletingStatus.error)  return  <p> Deleting error :( {deletingStatus.error}</p>;

    if (isEditMode)
      return (
        <Card className={styles.plant}>
          <CardBody>
            <PlantsEdit plant={plant} index={index} action={toggleEditMode}/>
          </CardBody>
        </Card>
      )

    return (
      <Card className={`${styles.plant} ${styles[backgroundColor()]}`}>
        <CardBody>
          <section className={styles.controls}>
            <Button outline onClick={toWater} title="Water" className={uiStyles.roundButton}>&#128166;</Button>
            <Button outline onClick={toggleEditMode} title="Edit" className={uiStyles.roundButton}>&#x270E;</Button>
            <Button outline onClick={toggleModal} title="Remove" className={uiStyles.roundButton}>&#x1F5D1;</Button>
          </section>
          <div className={styles.image}>&#129716;</div>
          <CardTitle tag="h5">{plant.name}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{plant.scientificName}</CardSubtitle>
          <WhenToWater daysUntilNextWatering={plant.daysUntilNextWatering}/>
          <Progress value={ plantHealth } color={ healthColor() }/>
        </CardBody>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Delete plant {plant.name} </ModalHeader>
          <ModalBody>
            Warning! This action is irreversible.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDeletion}>Delete!</Button>
            <Button color="secondary" onClick={toggleModal}>Cancel!</Button>
          </ModalFooter>
        </Modal>

      </Card>
    )
}

export { Plant }
