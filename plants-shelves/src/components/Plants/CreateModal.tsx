import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
import { PlantsCreate } from './PlantsCreate';

interface PlantsNavBarProps {
    isOpen: boolean,
    toggleAction: () => any
}

const CreateModal = ({isOpen, toggleAction}: PlantsNavBarProps) => {
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleAction} autoFocus={false}>
            <ModalHeader toggle={toggleAction}>Create new plant </ModalHeader>
            <ModalBody>
              <PlantsCreate action={toggleAction} />
            </ModalBody>
      </Modal>
    </>
  );
}

export default CreateModal;


