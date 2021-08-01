import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Input, Spinner } from 'reactstrap';

import { UPDATE_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'
import AutoCompleteInput from '../UI/AutoCompleteInput';
import styles from "./Plant.module.css"
import uiStyles from "../UI/UIElements.module.css"
import ErrorHandler from './ErrorHandler';

interface PlantsEditProps extends PlantData { index: number, action?: () => any }

function PlantsEdit({ plant, index, action }: PlantsEditProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);
  const [scientificName, setScientificName] = useState(plant.scientificName);

  const [updatePlant, { loading, error }] = useMutation(UPDATE_PLANT, {
    onCompleted: (data: { updatePlant: PlantData }) => {
      dispatch && dispatch({ type: 'update', plant: data.updatePlant.plant, index: index});
      action && action();
      setSubmitted(true);
    },
    onError: (e) => console.error('Error creating plant:', e)
  });

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(event.target.value);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScientificName(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      updatePlant({ variables: { plantId: plant.id, plantName, scientificName } })
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
    >
      <section className={styles.controls}>
        <Button outline color="success" title="Save!" className={uiStyles.roundButton} type="submit">&#10003;</Button>
        <Button outline color="danger" title="Cancel!" onClick={action} className={uiStyles.roundButton}>&#10060;</Button>
      </section>
      <div className={styles.image}>&#129716;</div>

      <FormGroup>
        <Input type="text" title="Plant name" name="name" id="name" data-testid="plant-name-input" placeholder="Plant name"
          value={plantName}
          onChange={handlePlantNameInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <AutoCompleteInput
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          data-testid="plant-scientific-name-input"
          value={scientificName}
          setValue={setScientificName}
          onChange={handleScientificNameInputChange}
          required
          />
      </FormGroup>
    </Form>
  )
}

export default PlantsEdit
