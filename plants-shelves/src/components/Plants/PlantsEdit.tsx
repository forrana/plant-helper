import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';

import { DELETE_PLANT, UPDATE_PLANT } from './queries'
import { usePlantsDispatch } from './PlantsDispatch';
import { PlantData, PlantNickName, RoomType } from './models'
import styles from "./Plant.module.css"
import editStyles from "./PlantsEdit.module.css"
import uiStyles from "../UI/UIElements.module.css"
import ErrorHandler from './ErrorHandler';
import pot from './images/pot.png'
import PlantNameInput from './PlantNameInput';
import RoomNameInput from './RoomNameInput';
import { generateColorForGroup } from './utils';

interface PlantsEditProps extends PlantData { index: number, action?: () => any }

function PlantsEdit({ plant, index, action }: PlantsEditProps) {
  const dispatch = usePlantsDispatch()
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);
  const [groupName, setGroupName] = useState(plant.room?.roomName || "");
  const [groupId, setGroupId] = useState(plant.room?.id || 0)
  const [groupColor, setGroupColor] = useState(plant.room?.colorBackground || "#FFFFFF");
  const [scientificName, setScientificName] = useState(plant.scientificName);
  const [daysBetweenWateringGrowing, setDaysBetweenWateringGrowing] = useState(plant.daysBetweenWateringGrowing)
  const [daysBetweenWateringDormant, setDaysBetweenWateringDormant] = useState(plant.daysBetweenWateringDormant)
  const [postponeDays, setPostponeDays] = useState(plant.daysPostpone)


  const [updatePlant, { loading, error }] = useMutation(UPDATE_PLANT, {
    onCompleted: (data: { updatePlant: PlantData }) => {
      dispatch({ type: 'update', plant: data.updatePlant.plant, index: index});
      action && action();
      setSubmitted(true);
    },
    onError: (e) => console.error('Error updating plant:', e)
  });

  const setPlantSettings = (plantSuggestion: PlantNickName) => {
    setPlantName(plantSuggestion.name);
    setScientificName(plantSuggestion.plantEntry.scientificName);
    setDaysBetweenWateringGrowing(plantSuggestion.plantEntry.daysBetweenWateringGrowingInt);
    setDaysBetweenWateringDormant(plantSuggestion.plantEntry.daysBetweenWateringDormantInt);
  }

  const setRoomNameFromSuggestion = (roomSuggestion: RoomType) => {
    const newValue = roomSuggestion.roomName;
    setGroupColor(roomSuggestion.colorBackground);
    setGroupName(newValue);
    setGroupId(roomSuggestion.id);
  }

  const cleanRoomName = () => {
    setGroupName("");
    setGroupId(0);
  }

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(event.target.value);
  };

  const handleGroupNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setGroupColor(generateColorForGroup(newValue))
    setGroupName(newValue);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScientificName(event.target.value);
  };

  const handleSetGroupColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupColor(event.target.value);
  };

  const handleDaysBetweenWateringGrowingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWateringGrowing(parseInt(event.target.value))
  }

  const handleDaysBetweenWateringDormantInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWateringDormant(parseInt(event.target.value))
  }

  const handleDaysPostponeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostponeDays(parseInt(event.target.value))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      updatePlant({ variables: {
        plantId: plant.id,
        plantName,
        scientificName,
        daysBetweenWateringDormant,
        daysBetweenWateringGrowing,
        postponeDays,
        groupName,
        colorBackground: groupColor,
      } })
    }
  }

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [deletePlant, deletingStatus] = useMutation(DELETE_PLANT, {
    onCompleted: () => {
      dispatch({ type: 'delete', index: index });
      toggleModal();
      action && action();
    },
    onError: (e) => console.error('Error deleting plant:', e)
  });

  const confirmDeletion = () => {
    deletePlant({variables: { plantId: plant.id } });
  }

  if (submitted) return <Redirect push to="/"/>

  if (loading || deletingStatus.loading) return  <Spinner color="primary" />

  return (
    <>
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      autoFocus={false}
    >
      <section className={styles.viewControls}>
        <span></span>
        <Button outline color="danger" onClick={toggleModal} title="Remove" data-testid="remove-btn">Delete!</Button>
      </section>
      <img src={pot} alt="plant pot" className={editStyles.image}/>
      <FormGroup floating>
        <PlantNameInput type="text" title="Plant name" name="name" id="name" data-testid="plant-name-input" placeholder="Plant name"
          value={plantName}
          setValue={setPlantSettings}
          onChange={handlePlantNameInputChange}
          autoFocus={true}
          required
        />
        <Label for="name">Name:</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          data-testid="plant-scientific-name-input"
          value={scientificName}
          onChange={handleScientificNameInputChange}
          required
          />
        <Label for="scientificName">Scientific name:</Label>
      </FormGroup>
      <FormGroup>
        <InputGroup className={editStyles.autoInputWithColorPicker} id="groupNameInput">
          <RoomNameInput type="text" name="groupName" id="groupName" placeholder="Group name"
            className={editStyles.groupInput}
            data-testid="plant-group-name-input"
            value={groupName}
            setValue={setRoomNameFromSuggestion}
            onChange={handleGroupNameInputChange}
            roomId={groupId}
            roomColor={groupColor}
            roomName={groupName}
            badgeClassName={editStyles.groupBadge}
            removeAction={cleanRoomName}
          />
          <InputGroupText className={editStyles.colorPickerContainer}>
            <Input type="color" name="groupColor" placeholder="Group color" alt="Group color"
              className={editStyles.colorPickerInput}
              data-testid="plant-group-color-input"
              setValue={setGroupColor}
              onChange={handleSetGroupColorInputChange}
              value={groupColor}
            />
          </InputGroupText>
        </InputGroup>
      </FormGroup>
      <FormGroup floating>
        <Input
          min={0} max={100} type="number" step="1"
          name="postponeDays" id="postponeDays" placeholder="Postpone days"
          data-testid="plant-days-postpone-input"
          value={postponeDays}
          setValue={setPostponeDays}
          onChange={handleDaysPostponeInputChange}
          required
          />
        <Label for="postponeDays">Postpone days:</Label>
      </FormGroup>
      <FormGroup>
        <section className={styles.label}>
          <i className="icon icon-droplet"></i>
          <h4 className={styles.header}><i className="icon icon-droplet"></i></h4>
        </section>
        <Input type="range" name="daysBetweenWateringGrowing" id="daysBetweenWateringGrowing" placeholder="Days between watering growing"
            value={daysBetweenWateringGrowing}
            data-testid="days-between-watering-growing-input"
            onChange={handleDaysBetweenWateringGrowingInputChange}
            autoFocus={true}
            min={1}
            max={30}
            required
          />
        <div className="text-center"><small><b>Growing season</b> {daysBetweenWateringGrowing} day(s) between waterings</small></div>
      </FormGroup>
      <FormGroup>
        <section className={styles.label}>
          <i className="icon icon-droplet"></i>
          <h4 className={styles.header}><i className="icon icon-droplet"></i></h4>
        </section>
        <Input type="range" name="daysBetweenWateringDormant" id="daysBetweenWateringDormant" placeholder="Days between watering dormant"
            value={daysBetweenWateringDormant}
            data-testid="days-between-watering-dormant-input"
            onChange={handleDaysBetweenWateringDormantInputChange}
            autoFocus={true}
            min={1}
            max={30}
            required
          />
        <div className="text-center"><small><b>Dormant season</b> {daysBetweenWateringDormant} day(s) between waterings</small></div>
      </FormGroup>
      <section className={styles.viewControls}>
        <Button color="success" title="Save!" type="submit">Save changes!</Button>
        <Button outline color="danger" title="Cancel!" onClick={action}>Cancel</Button>
      </section>
    </Form>
    <Modal isOpen={modal} toggle={toggleModal} autoFocus={false}>
        <ModalHeader toggle={toggleModal}>Delete plant {plant.name} </ModalHeader>
        <ModalBody>
          Warning! This action is irreversible.
        </ModalBody>
        <ModalFooter className={uiStyles.footer}>
          <Button color="danger" onClick={confirmDeletion} data-testid="modal-button-delete">Delete!</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel!</Button>
        </ModalFooter>
    </Modal>
    <ErrorHandler error={error} />
    <ErrorHandler error={deletingStatus.error} />
    </>
  )
}

export default PlantsEdit
