import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Input, Spinner } from 'reactstrap';

import { UPDATE_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'

import styles from "./Plant.module.css"
import uiStyles from "../UI/UIElements.module.css"

interface PlantsEditProps extends PlantData { index: number, action?: () => any }

function PlantsEdit({ plant, index, action }: PlantsEditProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);
  const [scientificName, setScientificName] = useState(plant.scientificName);

  const [updatePlant, { loading, error }] = useMutation(UPDATE_PLANT, {
    // TODO move to the separate function
    onCompleted: (data: { updatePlant: PlantData }) => {
      dispatch && dispatch({ type: 'update', plant: data.updatePlant.plant, index: index});
      action && action();
      setSubmitted(true);
    }
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

  if (error)  return  <p>Error :( {error.message}</p>;

  return (
    <Form
      onSubmit={handleFormSubmit}
    >
      <section className={styles.controls}>
        <Button outline color="success" title="Save!" className={uiStyles.roundButton} type="submit">&#10003;</Button>
        <Button outline color="danger" title="Cancel!" onClick={action} className={uiStyles.roundButton}>&#10060;</Button>
      </section>
      <div className={styles.image}>&#129716;</div>

      <FormGroup>
        <Input type="text" title="Plant name" name="name" id="name" placeholder="Plant name"
          value={plantName}
          onChange={handlePlantNameInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Input type="text" title="Scientific name" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          onChange={handleScientificNameInputChange}
        />
      </FormGroup>
    </Form>
  )
}

export default PlantsEdit
