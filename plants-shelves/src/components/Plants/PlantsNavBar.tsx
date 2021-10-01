import React, { useState, useContext } from 'react';
import {
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
  } from 'reactstrap';
import UserContext from '../User/UserContext'
import uiStyles from '../UI/UIElements.module.css'
import CreateModal from './CreateModal';

const PlantsNavBar = () => {
  const userContext = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand><img src="icon-192.png" alt="app logo"/></NavbarBrand>
        <Nav className="mr-auto" navbar>
            <NavItem>
              <Button onClick={toggleModal} data-testid="create-btn" outline className={uiStyles.roundButton} color="primary" title="Add new plant">
                &#10133;
              </Button>
            </NavItem>
          </Nav>
        <NavbarText>Welcome <b>{ userContext.username }</b></NavbarText>
        <NavLink href="/logout">Logout</NavLink>
      </Navbar>
      <CreateModal isOpen={modal} toggleAction={toggleModal} />
    </>
  );
}

export default PlantsNavBar;


