import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { ADD_PLANT } from '../queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData, PlantType } from './models'

function PlantsCreate() {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");

  const [addPlant, { loading, data, error }] = useMutation(ADD_PLANT, {
    // TODO move to the separate function
    onCompleted: (data: { createPlant: { plant: PlantType } }) => {
      dispatch && dispatch({ type: 'add', plant: data.createPlant.plant })
      setPlantName("");
      setScientificName("");
      setSubmitted(true)
    }
  });

  const handlePlantNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setPlantName(event.target.value);
  };

  const handleScientificNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
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
      <Button type="submit">Add plant</Button>
    </Form>
  )
}

export { PlantsCreate }
