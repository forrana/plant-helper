import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input, Spinner, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import { PASSWORD_RESET_EMAIL } from './queries'
import styles from "./Login.module.css"
import { ResetError } from "./models"
import ErrorHandler from '../Plants/ErrorHandler';
import LoadingScreen from '../Plants/LoadingScreen';
import { useAlertDispatch } from '../UI/AlertDispatch';

function UserPasswordResetEmail() {
  const dispatch = useAlertDispatch();

  const [email, setEmail] = useState("");
  const [resetErrors, setResetErrors] = useState<Array<ResetError>>([]);

  const history = useHistory();
  const goToHomePage = () => history.push("/");

  const [sendPasswordResetEmail, { client, loading, error }] = useMutation(PASSWORD_RESET_EMAIL, {
    onCompleted: (data: any) => {
      setEmail("");
      const errors: Array<ResetError> = data?.sendPasswordResetEmail?.errors?.nonFieldErrors;
      if(errors) {
        setResetErrors(errors);
      } else {
        dispatch({
          type: "addMessage",
          message: { description: "We've sent you an email with a password reset link!", color: "success" }
        })
        setResetErrors([]);
        goToHomePage();
      }
    },
    onError: (e) => console.error('Login error:', e)
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(email) {
      sendPasswordResetEmail({ variables: { email }})
    }
  }

  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <main>
      <Form
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className={styles.container}
      >
        <FormGroup floating>
          <Input type="email" name="email" id="email" placeholder="Enter email"
            value={email}
            onChange={handleEmailInputChange}
            invalid={resetErrors.length > 0}
            required
          />
          <Label for="email">Email:</Label>
          {
            resetErrors.map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <section className={styles.controls}>
          <Button type="submit" data-testid="login-submit-button">Send email</Button>
          <Link to="/signup" className={styles.link}>Signup instead</Link>
        </section>
      </Form>
      <LoadingScreen isLoading={loading} isFullScreen={false}/>
      <ErrorHandler error={error} />
    </main>
  )
}

export default UserPasswordResetEmail
