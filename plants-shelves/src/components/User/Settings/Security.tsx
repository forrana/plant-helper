import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import ErrorHandler from '../../Plants/ErrorHandler';
import LoadingScreen from '../../Plants/LoadingScreen';
import { FormErrors } from '../models';
import { UPSERT_USER_SETTINGS } from '../queries';
import uiStyles from "../../UI/UIElements.module.css"
import { useAlertDispatch } from '../../UI/AlertDispatch';
import { getFormFieldErrors, isFieldHasErrors } from '../formUtils';

interface SecurityProps {
  action: () => any
}

function Security({ action }: SecurityProps) {
    const alertDispatch = useAlertDispatch()
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [email, setEmail] = useState("");

    const [ updateSettings, updateSettingsState ] = useMutation(UPSERT_USER_SETTINGS, {
      onCompleted: (data: any) => {
        const errors: FormErrors = data?.register?.errors;
        if(errors) {
          setFormErrors(errors);
        } else {
          setFormErrors({});
          alertDispatch({
            type: "addMessage",
            message: { description: "Settings successfully updated", color: "success" }
          })
          action();
        }
      },
      onError: (e) => console.error('Error updateing settings:', e)
    });


    const resetFieldErrors = (field: string) => {
      setFormErrors({...formErrors, [field]: []})
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if(email) {
        updateSettings({ variables: {
          email: email
        }});
      }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      resetFieldErrors(name);
      switch(name) {
        case "email": setEmail(event.target.value); break;
      }
    }

    return (
    <>
      <Form
        onSubmit={handleFormSubmit}
        autoFocus={false}
        data-testid="user-settings-form"
      >
          <FormGroup floating>
            <Input type="email" name="email" id="email" placeholder="Enter email"
              autoComplete="off"
              value={email}
              onChange={handleInputChange}
              invalid={isFieldHasErrors("email", formErrors)}
              readOnly={true}
              required
            />
            {
              getFormFieldErrors("email", formErrors).map((error, index) =>
                <FormFeedback key={index} data-testid="settings-email-error">{ error.message }</FormFeedback>
              )
            }
            <Label for="email">Email:</Label>
          </FormGroup>
        <section className={uiStyles.footer}>
          <Button color="success" title="Save!" type="submit">Save changes!</Button>
          <Button outline color="danger" title="Cancel!" onClick={action}>Cancel</Button>
        </section>
      </Form>
      <LoadingScreen isLoading={updateSettingsState.loading} isFullScreen={true}/>
      <ErrorHandler error={updateSettingsState.error} />
    </>
    )
}

export default Security
