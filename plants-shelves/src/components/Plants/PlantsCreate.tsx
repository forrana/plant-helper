import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner, InputGroup, InputGroupText } from 'reactstrap';

import { ADD_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData, PlantNickName, RoomType } from './models'
import ErrorHandler from './ErrorHandler';
import styles from "./Plant.module.css"
import PlantNameInput from './PlantNameInput';
import editStyles from "./PlantsEdit.module.css"
import RoomNameInput from './RoomNameInput';
import { generateColorForGroup } from './utils';


interface PlantsCreateProps { action?: () => void; }

function PlantsCreate({ action }: PlantsCreateProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(0)
  const [groupColor, setGroupColor] = useState("#FFFFFF");
  const [daysBetweenWateringGrowing, setDaysBetweenWateringGrowing] = useState(7)
  const [daysBetweenWateringDormant, setDaysBetweenWateringDormant] = useState(10)

  const [addPlant, { loading, error }] = useMutation(ADD_PLANT, {
    onCompleted: (data: { createPlant: PlantData }) => {
      dispatch && dispatch({ type: 'add', plant: data.createPlant.plant })
      setPlantName("");
      setScientificName("");
      setGroupColor("#FFFFFF");
      setSubmitted(true);
      action && action();
    },
    onError: (e) => console.error('Error creating plant:', e)
  });

  const setPlantSettings = (plantSuggestion: PlantNickName) => {
    setPlantName(plantSuggestion.name);
    setScientificName(plantSuggestion.plantEntry.scientificName);
    setDaysBetweenWateringGrowing(plantSuggestion.plantEntry.daysBetweenWateringGrowingInt);
    setDaysBetweenWateringDormant(plantSuggestion.plantEntry.daysBetweenWateringDormantInt);
  }

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(event.target.value);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScientificName(event.target.value);
  };

  const handleDaysBetweenWateringGrowingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWateringGrowing(parseInt(event.target.value))
  }

  const handleDaysBetweenWateringDormantInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWateringDormant(parseInt(event.target.value))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      addPlant({ variables: {
        plantName, scientificName, daysBetweenWateringGrowing, daysBetweenWateringDormant,
        groupName,
        colorBackground: groupColor,
      } })
    }
  }

  const handleGroupNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setGroupColor(generateColorForGroup(newValue))
    setGroupName(newValue);
  };

  const handleSetGroupColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupColor(event.target.value);
  };

  const cleanRoomName = () => {
    setGroupName("");
    setGroupId(0);
  }

  const setRoomNameFromSuggestion = (roomSuggestion: RoomType) => {
    const newValue = roomSuggestion.roomName;
    setGroupColor(roomSuggestion.colorBackground);
    setGroupName(newValue);
    setGroupId(roomSuggestion.id);
  }

  if (submitted) return <Redirect push to="/"/>

  if (loading) return  <Spinner color="primary" />

  return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      data-testid="plant-create-form"
    >
      <FormGroup floating>
        <PlantNameInput type="text" name="name" id="name" placeholder="Plant name"
          value={plantName}
          data-testid="name-input"
          setValue={setPlantSettings}
          onChange={handlePlantNameInputChange}
          autoFocus={true}
          required
        />
        <Label for="name">Name</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          data-testid="sc-name-input"
          onChange={handleScientificNameInputChange}
          required
          />
        <Label for="scientificName">Scientific name</Label>
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
      <Button type="submit" className={styles.button}>Add plant</Button>
      <ErrorHandler error={error} />
    </Form>
  )
}

export { PlantsCreate }
