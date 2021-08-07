import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';

import { CREATE_USER } from './queries'
import styles from "./Login.module.css"
import { SignupErrors, Error } from './models';

function Signup() {
  const [username, setLogin] = useState("");
  const [password1, setPassword] = useState("");
  const [password2, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});

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
      const errors: SignupErrors = data?.register?.errors;
      if(errors) {
        setSignupErrors(errors);
      } else {
        setSignupErrors({});
        setLogin("");
        setPassword("");
        setPasswordConfirmation("");
        setEmail("");
      }
    },
    onError: (e) => console.error('Signup error:', e)
  });

  const getFieldErrors = (field: string): Array<Error> => {
    let result: Array<Error> = [];
    if(signupErrors[field]) {
      result = [...result, ...signupErrors[field]];
    }
    if(signupErrors['nonFieldErrors']) {
      result = [...result, ...signupErrors['nonFieldErrors']];
    }
    return result;
  }

  const resetFieldErrors = (field: string) => {
    setSignupErrors({...signupErrors, [field]: []})
  }

  const isFieldHasErrors = (field: string): boolean => getFieldErrors(field).length > 0;

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
            invalid={isFieldHasErrors("username")}
            required
          />
          {
            getFieldErrors("username").map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="email">Email:</Label>
          <Input type="email" name="email" id="email" placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("email")}
            required
          />
          {
            getFieldErrors("email").map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="password">Password:</Label>
          <Input type="password" name="password1" id="password" placeholder="Enter password"
            autoComplete="off"
            value={password1}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("password1")}
            required
          />
          {
            getFieldErrors("password1").map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup>
          <Label for="password-confirmation">Password confirmation:</Label>
          <Input type="password" name="password2" id="password-confirmation" placeholder="Re-enter password"
            autoComplete="off"
            value={password2}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("password2")}
            required
          />
          {
            getFieldErrors("password2").map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <section className={styles.controls}>
          <Button type="submit">Create</Button>
        </section>
      </Form>
    </main>
  )
}

export default Signup
