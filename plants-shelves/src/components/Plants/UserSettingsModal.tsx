import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
import Settings from '../User/Settings';

interface UserSettingsModalProps {
  isOpen: boolean,
  toggleAction: () => any
}

const UserSettingsModal = ({isOpen, toggleAction}: UserSettingsModalProps) => {
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleAction} autoFocus={false}>
            <ModalHeader toggle={toggleAction}>User Settings </ModalHeader>
            <ModalBody>
              <Settings action={toggleAction} />
            </ModalBody>
      </Modal>
    </>
  );
}

export default UserSettingsModal;


