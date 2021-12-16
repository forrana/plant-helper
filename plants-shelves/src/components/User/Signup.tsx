import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router-dom";

import { CREATE_USER } from './queries'
import styles from "./Login.module.css"
import { FormErrors } from './models';
import { Link } from 'react-router-dom';
import { useAlertDispatch } from '../UI/AlertDispatch';
import { getFormFieldErrors, isFieldHasErrors } from './formUtils';

function Signup() {
  const history = useHistory()
  const dispatch = useAlertDispatch();

  const [username, setLogin] = useState("");
  const [password1, setPassword] = useState("");
  const [password2, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      resetFieldErrors(name);
      switch(name) {
        case "username": setLogin(event.target.value); break;
        case "password1": setPassword(event.target.value); break;
        case "password2": setPasswordConfirmation(event.target.value); break;
        case "email": setEmail(event.target.value); break;
      }
  }

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: (data: any) => {
      const errors: FormErrors = data?.register?.errors;
      if(errors) {
        setSignupErrors(errors);
      } else {
        setSignupErrors({});
        setLogin("");
        setPassword("");
        setPasswordConfirmation("");
        setEmail("");
        history.push("/");
        dispatch({
          type: "addMessage",
          message: { description: "User is successfully created! \nBut you need to verify your email first!", color: "warning" }
        })
      }
    },
    onError: (e) => console.error('Signup error:', e)
  });

  const resetFieldErrors = (field: string) => {
    setSignupErrors({...signupErrors, [field]: []})
  }


  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createUser({ variables: { username, email, password1, password2 } })
  }

  if (loading) return  <Spinner color="primary" />

  if (error)  return  <p>Error :( {error.message}</p>;

  return (
    <main>
      <Form
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className={styles.container}
      >
        <FormGroup>
          <Label for="login">Login:</Label>
          <Input type="text" name="username" id="login" placeholder="Enter login"
            autoComplete="off"
            value={username}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("username", signupErrors)}
            required
          />
          {
            getFormFieldErrors("username", signupErrors).map((error, index) =>
              <FormFeedback key={index} data-testid="signup-username-error">{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="email">Email:</Label>
          <Input type="email" name="email" id="email" placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("email", signupErrors)}
            required
          />
          {
            getFormFieldErrors("email", signupErrors).map((error, index) =>
              <FormFeedback key={index} data-testid="signup-email-error">{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="password">Password:</Label>
          <Input type="password" name="password1" id="password" placeholder="Enter password"
            autoComplete="off"
            value={password1}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("password1", signupErrors)}
            required
          />
          {
            getFormFieldErrors("password1", signupErrors).map((error, index) =>
              <FormFeedback key={index} data-testid="signup-password-1-error">{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="password-confirmation">Password confirmation:</Label>
          <Input type="password" name="password2" id="password-confirmation" placeholder="Re-enter password"
            autoComplete="off"
            value={password2}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("password2", signupErrors)}
            required
          />
          {
            getFormFieldErrors("password2", signupErrors).map((error, index) =>
              <FormFeedback key={index} data-testid="signup-password-2-error">{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <section className={styles.controls}>
          <Button type="submit" data-testid="signup-submit-button">Create</Button>
          <Button color="link">
            <Link to="/login">Login</Link>
          </Button>
        </section>
      </Form>
    </main>
  )
}

export default Signup
