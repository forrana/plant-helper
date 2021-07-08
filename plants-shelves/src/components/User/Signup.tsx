import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { useMutation } from '@apollo/client';

import { CREATE_USER } from './queries'
import styles from "./Login.module.css"

function Signup() {
  const [username, setLogin] = useState("");
  const [password1, setPassword] = useState("");
  const [password2, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");

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

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: (data: any) => {
      setLogin("");
      setPassword("");
      setPasswordConfirmation("");
      setEmail("")
    }
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createUser({ variables: { username, email, password1, password2 } })
  }

  if (loading) return  <Spinner color="primary" />

  if (error)  return  <p>Error :( {error.message}</p>;

  return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      className={styles.container}
    >
      <FormGroup>
        <Label for="login">Login:</Label>
        <Input type="text" name="login" id="login" placeholder="Enter login"
          value={username}
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
          value={password1}
          onChange={handlePasswordInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password-confirmation">Password confirmation:</Label>
        <Input type="password" name="password-confirmation" id="password-confirmation" placeholder="Re-enter password"
          value={password2}
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
