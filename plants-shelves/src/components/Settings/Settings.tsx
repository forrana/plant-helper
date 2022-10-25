import React, { useState } from 'react';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import Notifications from './Notifications';
import Security from './Security';
import Sharing from './Sharing';


interface SettingsProps {
  action: () => any
}

function Settings({ action }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("1");

  const isActive = (index: string) => index === activeTab
  return (
  <>
  <Nav tabs>
    <NavItem>
      <NavLink
        className={isActive("1") ? "active" : ""}
        onClick={() => setActiveTab("1")}
      >
        Notifications
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={isActive("2") ? "active" : ""}
        onClick={() => setActiveTab("2")}
      >
        Security
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={isActive("3") ? "active" : ""}
        onClick={() => setActiveTab("3")}
      >
        Sharing
      </NavLink>
    </NavItem>
  </Nav>
  <TabContent activeTab={activeTab}>
    <TabPane tabId="2">
      <Row>
        <Col sm="12">
          <Security action={action}/>
        </Col>
      </Row>
    </TabPane>
    <TabPane tabId="1">
      <Row>
        <Col sm="12">
          <Notifications action={action}/>
        </Col>
      </Row>
    </TabPane>
    <TabPane tabId="3">
      <Row>
        <Col sm="12">
          <Sharing action={action}/>
        </Col>
      </Row>
    </TabPane>
  </TabContent>
  </>
  )
}

export default Settings
