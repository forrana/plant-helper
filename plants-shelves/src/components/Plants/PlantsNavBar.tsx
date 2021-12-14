import React, { useState, useContext } from 'react';
import {
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
    NavbarToggler,
    Collapse,
  } from 'reactstrap';
import UserContext from '../User/UserContext'
import uiStyles from '../UI/UIElements.module.css'
import CreateModal from './CreateModal';
import UserSettingsModal from './UserSettingsModal';

const PlantsNavBar = () => {
  const userContext = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const toggleModal = () => setModal(!modal);
  const toggleSettingsModal = () => setSettingsModal(!settingsModal);
  const toggleMenu = () => setMenu(!menu)

  return (
    <>
      <Navbar color="light" light expand="md" fixed="top">
        <NavbarBrand><img src="icon-192.png" alt="app logo"/></NavbarBrand>
        <Nav navbar>
            <NavItem>
              <Button onClick={toggleModal} data-testid="create-btn" outline className={uiStyles.roundButton} color="primary" title="Add new plant">
                &#10133;
              </Button>
            </NavItem>
          </Nav>
        <NavbarText>Hi, <b>{ userContext.username }</b></NavbarText>
        <NavbarToggler
          className="me-2"
          onClick={toggleMenu}
        />
        <Collapse
          isOpen={menu}
          navbar
        >
          <Button onClick={toggleSettingsModal} color="link">Settings</Button>
          <hr />
          <NavLink active href="/logout">Logout</NavLink>
        </Collapse>
      </Navbar>
      <CreateModal isOpen={modal} toggleAction={toggleModal} />
      <UserSettingsModal isOpen={settingsModal} toggleAction={toggleSettingsModal} />
    </>
  );
}

export default PlantsNavBar;


