import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { ADD_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'
import AutoCompleteInput from '../UI/AutoCompleteInput';

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
      addPlant({ variables: { plantName, scientificName } })
    }
  }

  if (submitted) return <Redirect push to="/"/>

  if (loading) return  <Spinner color="primary" />

  if (error)  return  <p>Error :( {error.message}</p>;

  return (
    <Form
      onSubmit={handleFormSubmit}
      autocomplete="off"
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
        <AutoCompleteInput
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          value={scientificName}
          onChange={handleScientificNameInputChange}
        />
      </FormGroup>
      <Button type="submit">Add plant</Button>
    </Form>
  )
}

export { PlantsCreate }
