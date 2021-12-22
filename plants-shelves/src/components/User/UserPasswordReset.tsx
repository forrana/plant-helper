import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input, Spinner, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import { PASSWORD_RESET } from './queries'
import styles from "./Login.module.css"
import { FormErrors } from "./models"
import ErrorHandler from '../Plants/ErrorHandler';
import LoadingScreen from '../Plants/LoadingScreen';
import { useAlertDispatch } from '../UI/AlertDispatch';
import { getFormFieldErrors, isFieldHasErrors } from './formUtils';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserPasswordReset() {
  let query = useQuery();
  let token = query.get("token") || ""
  const dispatch = useAlertDispatch();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [resetErrors, setResetErrors] = useState<FormErrors>({});

  const history = useHistory();
  const goToHomePage = () => history.push("/");

  const [resetPassword, { client, loading, error }] = useMutation(PASSWORD_RESET, {
    onCompleted: (data: any) => {
      setPassword1("");
      setPassword2("");
      const errors: FormErrors = data?.passwordReset?.errors;
      if(errors) {
        setResetErrors(errors);
      } else {
        dispatch({
          type: "addMessage",
          message: { description: "Password was reset successfully!", color: "success" }
        })
        setResetErrors({});
        goToHomePage();
      }
    },
    onError: (e) => console.error('Login error:', e)
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(password1)
    resetPassword({ variables: { password1, password2, token }})
  }


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const name = event.target.name;
    resetFieldErrors(name);
    switch(name) {
      case "password1": setPassword1(event.target.value); break;
      case "password2": setPassword2(event.target.value); break;
    }
}

  const resetFieldErrors = (field: string) => {
    setResetErrors({...resetErrors, [field]: []})
  }

  return (
    <main>
      <Form
        onSubmit={handleFormSubmit}
        className={styles.container}
      >
        <FormGroup floating>
          <Input type="password" name="password1" id="password1" placeholder="Enter password"
            value={password1}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("newPassword1", resetErrors)}
            required
          />
          <Label for="password1">Password:</Label>
          {
            getFormFieldErrors("newPassword1", resetErrors).map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup floating>
          <Input type="password" name="password2" id="password2" placeholder="Confirm password"
            value={password2}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("newPassword2", resetErrors)}
            required
          />
          <Label for="password2">Confirmation:</Label>
          {
            getFormFieldErrors("newPassword2", resetErrors).map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <section className={styles.controls}>
          <Button type="submit" data-testid="login-submit-button">Reset</Button>
          <Link to="/signup" className={styles.link}>Signup instead</Link>
        </section>
      </Form>
      <LoadingScreen isLoading={loading} isFullScreen={false}/>
      <ErrorHandler error={error} />
    </main>
  )
}

export default UserPasswordReset
