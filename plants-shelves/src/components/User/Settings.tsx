import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { UserSettingsData, UserSettingsType } from './models';
import { GET_USER_SETTINGS } from './queries';

function Settings() {
    const defaultUserSettings: UserSettingsType = {
      notificationsStartTime: "",
      notificationsEndTime: "",
      timezone: ""
    }
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    }

    const [settings, setSettings] = useState<UserSettingsType>(defaultUserSettings);

    const handleStartTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, notificationsStartTime: event.target.value});
    };

    const handleEndTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, notificationsEndTime: event.target.value});
    };

    const handleTimezoneInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value && setSettings({...settings, timezone: event.target.value});
    };

    const { loading, data, error } = useQuery<UserSettingsData>(
        GET_USER_SETTINGS,
        {
          onCompleted: (data: UserSettingsData) => {
            setSettings(data.userSettings)
          },
          onError: (e) => console.error('Error getting user settings:', e)
        }
      );

    return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
      autoFocus={false}
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
      <section>
        <Button color="success" title="Save!" type="submit">Save changes!</Button>
        <Button outline color="danger" title="Cancel!">Cancel</Button>
      </section>
    </Form>)
}

export default Settings
