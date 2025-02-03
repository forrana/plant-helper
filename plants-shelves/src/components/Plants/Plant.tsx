import React, { useState, useContext } from 'react';
import { MutationResult, useMutation } from '@apollo/client';
import { PlantData, RoomType } from './models'
import { Card, CardBody, CardTitle, CardSubtitle, Progress, Button, Badge, ButtonGroup,
       } from 'reactstrap';
import { POSTPONE_WATERING, WATER_PLANT } from './queries'
import { usePlantsDispatch } from './PlantsDispatch'
import PlantsEdit from './PlantsEdit'
import styles from "./Plant.module.css"
import uiStyles from "../UI/UIElements.module.css"
import ErrorHandler from './ErrorHandler';
import fallback from './images/fallback.jpg'
import fallbackSad from './images/fallback_01.jpg'
import aloe from './images/aloe.jpg'
import aloeSad from './images/aloe_01.jpg'
import citrus from './images/citrus.jpg'
import citrusSad  from './images/citrus_01.jpg'
import peacyLily from './images/peace_lily.jpg'
import peacyLilySad from './images/peace_lily_01.jpg'
import ivy from './images/ivy.jpg'
import ivySad from './images/ivy_01.jpg'
import flamingoFlower from './images/flamingo_flower.jpg'
import flamingoFlowerSad from './images/flamingo_flower_01.jpg'
import EditModal from './EditModal';
import RoomBadge from './RoomBadge';
import LoadingScreen from './LoadingScreen';
import UserContext from '../User/UserContext'


interface PlantProps extends PlantData { index: number, room?: RoomType }
interface WhenToWaterProps { daysUntilNextWatering: number }

interface PlantImageProps {
  scientificName: string;
  className?: string;
  needsWater?: boolean;
}

function PlantImage({ scientificName, needsWater = false }: PlantImageProps) {
  const [imageError, setImageError] = useState(false);

  const getPlantImage = (scientificName: string) => {
    switch (scientificName.toLowerCase()) {
      case 'aloe vera':
        return needsWater ? aloeSad : aloe;
      case 'citrus':
        return needsWater ? citrusSad : citrus;
      case 'spathiphyllum':
        return needsWater ? peacyLilySad : peacyLily;
      case 'hedera helix':
        return needsWater ? ivySad : ivy;
      case 'anthurium':
        return needsWater ? flamingoFlowerSad : flamingoFlower;
      default:
        return needsWater ? fallbackSad : fallback;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const selectedImage = imageError ? fallback : getPlantImage(scientificName)

  return (
    <img 
      src={selectedImage} 
      alt="plant image" 
      className={styles.image}
      onError={handleImageError}
    />
  );
}

function WhenToWater({ daysUntilNextWatering }: WhenToWaterProps) {
  if(daysUntilNextWatering === 1)
    return (
      <div className="text-center text-muted"><small className="">Day to water</small></div>
    )

  if(daysUntilNextWatering < 1)
    return (
      <div className="text-center"><small>Water me!</small></div>
    )

  return (
    <div className="text-center text-muted"><small>Days to water</small></div>
  )
}

function Plant({ plant, index, room }: PlantProps) {
    const userContext = useContext(UserContext);

    const dispatch = usePlantsDispatch()

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const [isEditModal, setIsEditModal] = useState(false);
    const toggleEditModal = () => setIsEditModal(!isEditModal);

    const [waterPlant, wateringStatus] = useMutation(WATER_PLANT, {
      onCompleted: (data: { waterPlant: PlantData }) => {
        dispatch({ type: 'update', plant: data.waterPlant.plant, index: index })
      },
      onError: (e) => console.error('Error creating plant:', e)
    });

    const [postponeWatering, postponeWateringStatus] = useMutation(POSTPONE_WATERING, {
      onCompleted: (data: { postponeWatering: PlantData }) => {
        dispatch({ type: 'update', plant: data.postponeWatering.plant, index: index })
      },
      onError: (e) => console.error('Error postponing watering plant:', e)
    });


    const toWater = () => waterPlant({variables: { plantId: plant.id } });
    const toPostponeWatering = () => postponeWatering({variables: {plantId: plant.id, postponeDays: 1}})

    const daysToWatering = plant.daysUntilNextWatering
    const daysBetweenWatering = plant.daysBetweenWatering + plant.daysPostpone
    // TODO move functions to utils and consts to localstate values

    const getPlantHealth = (daysToWatering: number, daysBetweenWatering: number): number => {
      if(daysToWatering > 0) {
        return (daysToWatering / daysBetweenWatering)*100;
      }
      return 0;
    }

    const plantHealth = getPlantHealth(daysToWatering, daysBetweenWatering);

    const isBorrowedPlant = (owner: string, currentUser: string) => owner !== currentUser

    const borrowedStyle = isBorrowedPlant(plant.owner.username, userContext.username) ? styles.borrowedPlant : ""

    const getHealthColor = (daysToWatering: number, daysBetweenWatering: number) => {
      const plantHealth = getPlantHealth(daysToWatering, daysBetweenWatering)
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

    const healthColor = getHealthColor(daysToWatering, daysBetweenWatering)

    const getBackgroundColor = (daysToWatering: number, daysBetweenWatering: number) => {
      const plantHealth = getPlantHealth(daysToWatering, daysBetweenWatering)
      if( plantHealth >= 70) {
          return "success"
        } else if ( plantHealth >= 50 ) {
        return "info"
        } else if ( plantHealth > 20 ) {
          return "warning"
        } else if ( daysToWatering > 0) {
          return "danger"
        } else {
          return "alarm"
        }
    }

    const bgColor = getBackgroundColor(daysToWatering, daysBetweenWatering)
/*
    const onDragStartEvent: React.DragEventHandler = (event) => {
      // @ts-ignore
      event.currentTarget.style.border = "1px dashed rgba(0,0,0,.125)";
      event.currentTarget.classList.add(styles.draggedPlant)
      event.dataTransfer.effectAllowed = "copyMove";
    }

    const onDragEndEvent: React.DragEventHandler = (event) => {
      // @ts-ignore
      event.currentTarget.style.border = "1px solid rgba(0,0,0,.125)";
      event.currentTarget.classList.remove(styles.draggedPlant);
    }
*/

    const isSomethingLoading = (actions: MutationResult<any>[]) =>
      actions.some(action => action.loading)

    if (isEditMode)
      return (
        <Card className={styles.plant}>
          <Badge color="light">{plant.symbol.userWideId}</Badge>
          <CardBody>
            <PlantsEdit plant={plant} index={index} action={toggleEditMode}/>
          </CardBody>
        </Card>
      )

    const color = room?.colorBackground;

    return (
      <Card
            className={`${styles.plant} ${styles[bgColor]} ${borrowedStyle}`} id={plant.id+""} data-testid={`plant-card-${index}`}
            style={{borderColor: color}}
            >
        <Badge color="dark" className={styles.badge}>#{plant.symbol.userWideId}</Badge>
        <CardBody className={styles.narrowCard}>
          <section className={styles.imageGroup}>
            <WhenToWater daysUntilNextWatering={daysToWatering}/>
            <ButtonGroup className={styles.progressGroup}>
              <Progress value={ plantHealth } color={ healthColor } className={styles.progressBar}>{daysToWatering}</Progress>
              <Button size="sm" color="primary" onClick={toPostponeWatering} title="Postpone Watering">+1</Button>
            </ButtonGroup>
          </section>
          <section className={styles.actions}>
            <Button size="sm" outline onClick={toWater} title="Water" data-testid="water-btn" className={uiStyles.roundButton}>&#128166;</Button>
            <PlantImage 
              scientificName={plant.scientificName} 
              needsWater={daysToWatering <= 0}
            />
            <Button size="sm" outline onClick={toggleEditModal} title="Edit" data-testid="edit-btn" className={uiStyles.roundButton}>
              <i className="icon icon-settings" />
            </Button>
          </section>
          <CardTitle tag="h5">{plant.name}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{plant.scientificName}</CardSubtitle>
        </CardBody>
        <RoomBadge room={room}></RoomBadge>
        <EditModal isOpen={isEditModal} toggleAction={toggleEditModal} index={index} plant={plant}/>
        <ErrorHandler error={wateringStatus.error} />
        <LoadingScreen isLoading={isSomethingLoading([wateringStatus, postponeWateringStatus])} isFullScreen={false}/>
      </Card>
    )
}

export { Plant }
