import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import ErrorHandler from '../Plants/ErrorHandler';
import LoadingScreen from '../Plants/LoadingScreen';
import { FormErrors, UserSettingsData, UserSettingsType } from './models';
import { GET_USER_SETTINGS, UPSERT_USER_SETTINGS } from './queries';
import uiStyles from "../UI/UIElements.module.css"
import { useAlertDispatch } from '../UI/AlertDispatch';
import { getFormFieldErrors, isFieldHasErrors } from './formUtils';

interface SettingsProps {
  action: () => any
}

function Settings({ action }: SettingsProps) {
    const alertDispatch = useAlertDispatch()
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [email, setEmail] = useState("");

    const defaultUserSettings: UserSettingsType = {
      notificationsStartTime: "",
      notificationsEndTime: "",
      timezone: ""
    }

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


    const { loading, error } = useQuery<UserSettingsData>(
        GET_USER_SETTINGS,
        {
          onCompleted: (data: UserSettingsData) => {
            setSettings(data.userSettings)
          },
          onError: (e) => console.error('Error getting user settings:', e)
        }
      );

    const [settings, setSettings] = useState<UserSettingsType>(defaultUserSettings);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { notificationsStartTime, notificationsEndTime, timezone } = settings;
      if(notificationsStartTime && notificationsEndTime && timezone) {
        updateSettings({ variables: {
          startTime: notificationsStartTime,
          endTime: notificationsEndTime,
          timezone: timezone
        }});
      }
    }

    const handleStartTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, notificationsStartTime: event.target.value});
    };

    const handleEndTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, notificationsEndTime: event.target.value});
    };

    const handleTimezoneInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, timezone: event.target.value});
    };

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
        <Input
          value={settings.notificationsStartTime}
          onChange={handleStartTimeInputChange}
          id="notificationsStartTime"
        />
        <Label for="notificationsStartTime">Notifications Start Time</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          value={settings.notificationsEndTime}
          onChange={handleEndTimeInputChange}
          id="notificationsEndTime"
        />
        <Label for="notificationsEndTime">Notifications End Time</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          value={settings.timezone}
          onChange={handleTimezoneInputChange}
          id="userTimezone"
        />
        <Label for="userTimezone">Timezone</Label>
      </FormGroup>
      <FormGroup floating>
          <Input type="email" name="email" id="email" placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={handleInputChange}
            invalid={isFieldHasErrors("email", formErrors)}
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
    <LoadingScreen isLoading={loading || updateSettingsState.loading} isFullScreen={true}/>
    <ErrorHandler error={error} />
    <ErrorHandler error={updateSettingsState.error} />
    </>
    )
}

export default Settings
