import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
import Settings from '../User/Settings';

interface PlantsNavBarProps {
    isOpen: boolean,
    toggleAction: () => any
}

const UserSettingsModal = ({isOpen, toggleAction}: PlantsNavBarProps) => {
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleAction} autoFocus={false}>
            <ModalHeader toggle={toggleAction}>User Settings </ModalHeader>
            <ModalBody>
              <Settings />
            </ModalBody>
      </Modal>
    </>
  );
}

export default UserSettingsModal;


