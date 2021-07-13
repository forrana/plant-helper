import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import { LOG_IN } from './queries'
import styles from "./Login.module.css"
import { LoginError } from "./models"

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Array<LoginError>>([]);

  const [loginUser, { loading, error }] = useMutation(LOG_IN, {
    onCompleted: (data: any) => {
      setLogin("");
      setPassword("");
      const errors: Array<LoginError> = data?.tokenAuth?.errors?.nonFieldErrors;
      if(errors) {
        setLoginErrors(errors);
      } else setLoginErrors([]);
    }
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(login && password) {
      loginUser({ variables: { username: login, password }})
    }
  }

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

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
          value={login}
          onChange={handleLoginInputChange}
          invalid={loginErrors.length > 0}
          required
        />
        {
          loginErrors.map((error, index) =>
            <FormFeedback key={index}>{ error.message }</FormFeedback>
          )
        }
      </FormGroup>
      <FormGroup>
        <Label for="password">Password:</Label>
        <Input type="password" name="password" id="password" placeholder="Enter password"
          value={password}
          onChange={handlePasswordInputChange}
          invalid={loginErrors.length > 0}
          required
        />
        {
          loginErrors.map((error, index) =>
            <FormFeedback key={index}>{ error.message }</FormFeedback>
          )
        }
      </FormGroup>
      <section className={styles.controls}>
        <Button type="submit">Login</Button>
        <Link to="/signup" className={styles.link}>Signup</Link>
      </section>
    </Form>
  )
}

export default Login
