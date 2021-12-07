import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
import { PlantType } from './models';
import PlantsEdit from './PlantsEdit';

interface PlantsNavBarProps {
    isOpen: boolean,
    toggleAction: () => any,
    index: number,
    plant: PlantType,
}

const EditModal = ({isOpen, toggleAction, index, plant}: PlantsNavBarProps) => {
  if(!plant) isOpen = false;
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleAction} autoFocus={false}>
            <ModalHeader toggle={toggleAction}>
              <b>{plant.symbol.userWideId}</b> - {plant.name}
              <small className="text-muted"> ({plant.scientificName}) </small>
            </ModalHeader>
            <ModalBody>
              <PlantsEdit index={index} plant={plant} action={toggleAction}/>
            </ModalBody>
      </Modal>
    </>
  );
}

export default EditModal;


