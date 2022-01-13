import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import styles from "./Login.module.css"
import { FormErrors } from '../models';
import { PASSWORD_CHANGE } from '../queries';
import { useAlertDispatch } from '../../UI/AlertDispatch';
import { getFormFieldErrors, isFieldHasErrors } from '../formUtils';
import LoadingScreen from '../../Plants/LoadingScreen';
import ErrorHandler from '../../Plants/ErrorHandler';


function PasswordChangeForm() {
  const dispatch = useAlertDispatch();
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [oldPassword, setOldPassword]   = useState("");
  const [resetErrors, setResetErrors]   = useState<FormErrors>({});

  const history = useHistory();
  const goToHomePage = () => history.push("/");

  const resetForm = () => {
      setNewPassword1("");
      setNewPassword2("");
      setOldPassword("");
  }

  const [resetPassword, { client, loading, error }] = useMutation(PASSWORD_CHANGE, {
    onCompleted: (data: any) => {
      const errors: FormErrors = data?.passwordReset?.errors;
      if(errors) {
        setResetErrors(errors);
      } else {
        resetForm();
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
    resetPassword({ variables: { oldPassword, newPassword1, newPassword2 }})
  }


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const name = event.target.name;
    resetFieldErrors(name);
    switch(name) {
      case "newPassword1": setNewPassword1(event.target.value); break;
      case "newPassword2": setNewPassword2(event.target.value); break;
      case "oldPassword": setOldPassword(event.target.value); break;
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
          <Input type="password" name="oldPassword" id="oldPassword" placeholder="Current Password"
            value={oldPassword}
            autoComplete={"password"}
            required
          />
          <Label for="username">Username:</Label>
        </FormGroup>
        <FormGroup floating>
          <Input type="password" name="newPassword1" id="newPassword1" placeholder="Enter password"
            value={newPassword1}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("newPassword1", resetErrors)}
            required
            autoComplete={"new-password"}
          />
          <Label for="newPassword1">Password:</Label>
          {
            getFormFieldErrors("newPassword1", resetErrors).map((error, index) =>
              <FormFeedback key={index}>{ error.message }</FormFeedback>
            )
          }
        </FormGroup>
        <FormGroup floating>
          <Input type="password" name="newPassword2" id="newPassword2" placeholder="Confirm password"
            value={newPassword2}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("newPassword2", resetErrors)}
            required
            autoComplete={"new-password"}
          />
          <Label for="newPassword2">Confirmation:</Label>
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

export default PasswordChangeForm
