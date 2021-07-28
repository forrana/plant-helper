import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { ADD_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'
import AutoCompleteInput from '../UI/AutoCompleteInput';
import ErrorHandler from './ErrorHandler';


interface PlantsCreateProps { action?: () => any }

function PlantsCreate({ action }: PlantsCreateProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");

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

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(event.target.value);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScientificName(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      addPlant({ variables: { plantName, scientificName } })
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
        <Input type="text" name="name" id="name" placeholder="Plant name"
          value={plantName}
          data-testid="name-input"
          onChange={handlePlantNameInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="scientificName">Scientific name:</Label>
        <AutoCompleteInput
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          data-testid="sc-name-input"
          setValue={setScientificName}
          onChange={handleScientificNameInputChange}
          required
          />
      </FormGroup>
      <Button type="submit">Add plant</Button>
    </Form>
  )
}

export { PlantsCreate }
