import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';

import { DELETE_PLANT, UPDATE_PLANT } from './queries'
import PlantsDispatch from './PlantsDispatch';
import { PlantData } from './models'
import AutoCompleteInput from '../UI/AutoCompleteInput';
import styles from "./Plant.module.css"
import editStyles from "./PlantsEdit.module.css"
import uiStyles from "../UI/UIElements.module.css"
import ErrorHandler from './ErrorHandler';
import pot from './images/pot.png'

interface PlantsEditProps extends PlantData { index: number, action?: () => any }

function PlantsEdit({ plant, index, action }: PlantsEditProps) {
  const dispatch = useContext(PlantsDispatch);
  const [submitted, setSubmitted] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);
  const [scientificName, setScientificName] = useState(plant.scientificName);
  const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant.daysBetweenWatering)


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

  const handleDaysBetweenWateringInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBetweenWatering(parseInt(event.target.value))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(plantName && scientificName) {
      updatePlant({ variables: { plantId: plant.id, plantName, scientificName, daysBetweenWatering } })
    }
  }

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [deletePlant, deletingStatus] = useMutation(DELETE_PLANT, {
    onCompleted: () => {
      dispatch && dispatch({ type: 'delete', index: index })
    },
    onError: (e) => console.error('Error deleting plant:', e)
  });

  const confirmDeletion = () => {
    deletePlant({variables: { plantId: plant.id } });
    toggleModal()
  }

  if (submitted) return <Redirect push to="/"/>

  if (loading || deletingStatus.loading) return  <Spinner color="primary" />

  if (error) {
    return  <ErrorHandler error={error} />
  }

  if (deletingStatus.error) {
    return  <ErrorHandler error={deletingStatus.error} />
  }

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
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input type="text" title="Plant name" name="name" id="name" data-testid="plant-name-input" placeholder="Plant name"
          value={plantName}
          onChange={handlePlantNameInputChange}
          autoFocus={true}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="scientificName">Scientific name:</Label>
        <AutoCompleteInput
          type="text" name="scientificName" id="scientificName" placeholder="Scientific name"
          data-testid="plant-scientific-name-input"
          value={scientificName}
          setValue={setScientificName}
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
        <small>Time between waterings, {daysBetweenWatering} day(s)</small>
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

    </>
  )
}

export default PlantsEdit
