import React, { useState } from 'react';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import Notifications from './Notifications';
import Security from './Security';


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
        Security
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={isActive("2") ? "active" : ""}
        onClick={() => setActiveTab("2")}
      >
        Notifications
      </NavLink>
    </NavItem>
  </Nav>
  <TabContent activeTab={activeTab}>
    <TabPane tabId="1">
      <Row>
        <Col sm="12">
          <Security action={action}/>
        </Col>
      </Row>
    </TabPane>
    <TabPane tabId="2">
      <Row>
        <Col sm="12">
          <Notifications action={action}/>
        </Col>
      </Row>
    </TabPane>
  </TabContent>
  </>
  )
}

export default Settings
