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

const CreateModal = ({isOpen, toggleAction, index, plant}: PlantsNavBarProps) => {
  if(!plant) isOpen = false;
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleAction} autoFocus={false}>
            <ModalHeader toggle={toggleAction}>Plant <b>{plant.symbol.userWideId}</b></ModalHeader>
            <ModalBody>
              <PlantsEdit index={index} plant={plant} action={toggleAction}/>
            </ModalBody>
      </Modal>
    </>
  );
}

export default CreateModal;


