import React, { useState, useContext } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
import UserContext from '../User/UserContext'
import { PlantsCreate } from './PlantsCreate';
import uiStyles from '../UI/UIElements.module.css'

const PlantsNavBar = () => {
  const userContext = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal)

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
;
  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand>Plants Shelves</NavbarBrand>
        <Nav className="mr-auto" navbar>
            <NavItem>
              <Button onClick={toggleModal} outline className={uiStyles.roundButton} color="primary" title="Add new plant">
                &#10133;
              </Button>
            </NavItem>
          </Nav>
        <NavbarText>Welcome { userContext.username }</NavbarText>
      </Navbar>
      <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Create new plant </ModalHeader>
            <ModalBody>
              <PlantsCreate action={toggleModal} />
            </ModalBody>
      </Modal>
    </>
  );
}

export default PlantsNavBar;


