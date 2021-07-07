import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styles from "./Login.module.css"

function Signup() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");

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

  const handlePasswordConfirmationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);
  };

  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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
        <Label for="email">Email:</Label>
        <Input type="email" name="email" id="email" placeholder="Enter email"
          value={email}
          onChange={handleEmailInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password:</Label>
        <Input type="password" name="password" id="password" placeholder="Enter password"
          value={password}
          onChange={handlePasswordInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password-confirmation">Password confirmation:</Label>
        <Input type="password" name="password-confirmation" id="password-confirmation" placeholder="Re-enter password"
          value={passwordConfirmation}
          onChange={handlePasswordConfirmationInputChange}
        />
      </FormGroup>
      <section className={styles.controls}>
        <Button type="submit">Create</Button>
      </section>
    </Form>
  )
}

export default Signup
