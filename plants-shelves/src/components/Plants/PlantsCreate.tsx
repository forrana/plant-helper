import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { ADD_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData, PlantNickName } from './models'
import AutoCompleteInput from '../UI/AutoCompleteInput';
import ErrorHandler from './ErrorHandler';
import styles from "./Plant.module.css"


interface PlantsCreateProps { action?: () => void; }

function PlantsCreate({ action }: PlantsCreateProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [daysBetweenWatering, setDaysBetweenWatering] = useState(7)

  const [addPlant, { loading, error }] = useMutation(ADD_PLANT, {
    onCompleted: (data: { createPlant: PlantData }) => {
      dispatch && dispatch({ type: 'add', plant: data.createPlant.plant })
      setPlantName("");
      setScientificName("");
      setSubmitted(true);
      action && action();
    },
    onError: (e) => console.error('Error creating plant:', e)
  });

  const setPlantSettings = (plantSuggestion: PlantNickName) => {
    setPlantName(plantSuggestion.name);
    setScientificName(plantSuggestion.plantEntry.scientificName);
    setDaysBetweenWatering(plantSuggestion.plantEntry.daysBetweenWateringGrowingInt);
  }

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(event.target.value);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScientificName(event.target.value);
  };

  const handleDaysBetweenWateringInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWatering(parseInt(event.target.value))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      addPlant({ variables: { plantName, scientificName, daysBetweenWatering } })
    }
  }

  if (submitted) return <Redirect push to="/"/>

  if (loading) return  <Spinner color="primary" />

  if (error) {
    return  <ErrorHandler error={error} />
  }

  return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      data-testid="plant-create-form"
    >
      <FormGroup>
        <Label for="name">Name:</Label>
        <AutoCompleteInput type="text" name="name" id="name" placeholder="Plant name"
          value={plantName}
          data-testid="name-input"
          setValue={setPlantSettings}
          onChange={handlePlantNameInputChange}
          autoFocus={true}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="scientificName">Scientific name:</Label>
        <Input
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          data-testid="sc-name-input"
          onChange={handleScientificNameInputChange}
          required
          />
      </FormGroup>
      <FormGroup>
        <section className={styles.label}>
          <i className="icon icon-droplet"></i>
          <h4 className={styles.header}><i className="icon icon-droplet"></i></h4>
        </section>
        <Input type="range" name="daysBetweenWatering" id="daysBetweenWatering" placeholder="Days between watering"
            value={daysBetweenWatering}
            data-testid="days-between-watering-input"
            onChange={handleDaysBetweenWateringInputChange}
            autoFocus={true}
            min={1}
            max={30}
            required
          />
        <div className="text-center"><small>{daysBetweenWatering} day(s) between waterings</small></div>
      </FormGroup>
      <Button type="submit" className={styles.button}>Add plant</Button>
    </Form>
  )
}

export { PlantsCreate }
