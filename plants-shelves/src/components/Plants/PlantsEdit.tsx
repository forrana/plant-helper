import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { UPDATE_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'

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
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input type="text" name="name" id="name" placeholder="Plant name"
          value={plantName}
          onChange={handlePlantNameInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="scientificName">Scientific name:</Label>
        <Input type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          onChange={handleScientificNameInputChange}
        />
      </FormGroup>
      <Button type="submit">Update plant</Button>
    </Form>
  )
}

export default PlantsEdit
