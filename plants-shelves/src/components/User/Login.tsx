import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import styles from "./Login.module.css"

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(login && password) {
      //TODO login code there, check https://django-graphql-auth.readthedocs.io/en/latest/quickstart/
    }
  }

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      className={styles.container}
    >
      <FormGroup>
        <Label for="login">Login:</Label>
        <Input type="text" name="login" id="login" placeholder="Enter login"
          value={login}
          onChange={handleLoginInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password:</Label>
        <Input type="password" name="password" id="password" placeholder="Enter password"
          value={password}
          onChange={handlePasswordInputChange}
        />
      </FormGroup>
      <section className={styles.controls}>
        <Button type="submit">Login</Button>
        <Link to="/signup" className={styles.link}>Signup</Link>
      </section>
    </Form>
  )
}

export default Login
