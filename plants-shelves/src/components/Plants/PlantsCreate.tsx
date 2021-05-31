import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PLANT } from '../queries'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from "react-router-dom";

function PlantsCreate() {
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [scientificName, setScientificName] = useState("");

  const [addPlant, { data }] = useMutation(ADD_PLANT);

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
      addPlant({ variables: { plantName, scientificName } }).then(
        () => {
          setPlantName("");
          setScientificName("");
          setSubmitted(true)
        }
      )
    }
  }

  if (submitted) {
    return <Redirect push to="/"/>
  }

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
