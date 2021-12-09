import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import ErrorHandler from '../Plants/ErrorHandler';
import LoadingScreen from '../Plants/LoadingScreen';
import { UserSettingsData, UserSettingsType } from './models';
import { GET_USER_SETTINGS, UPSERT_USER_SETTINGS } from './queries';
import uiStyles from "../UI/UIElements.module.css"
import { useAlertDispatch } from '../UI/AlertDispatch';

interface SettingsProps {
  action: () => any
}

function Settings({ action }: SettingsProps) {
    const alertDispatch = useAlertDispatch()

    const defaultUserSettings: UserSettingsType = {
      notificationsStartTime: "",
      notificationsEndTime: "",
      timezone: ""
    }

    const [ updateSettings, updateSettingsState ] = useMutation(UPSERT_USER_SETTINGS, {
      onCompleted: () => {
        alertDispatch({
          type: "addMessage",
          message: { description: "Settings successfully updated", color: "success" }
        })
        action();
      },
      onError: (e) => console.error('Error updateing settings:', e)
    });


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
