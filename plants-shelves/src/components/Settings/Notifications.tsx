import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Button, ButtonGroup, ButtonToggle, Form, FormGroup, Input, InputGroup, Label } from 'reactstrap';
import ErrorHandler from '../Plants/ErrorHandler';
import LoadingScreen from '../Plants/LoadingScreen';
// TODO move to this folder
import { FormErrors, UserSettingsData, UserSettingsType } from '../User/models';
import { GET_USER_SETTINGS, UPSERT_USER_SETTINGS } from '../User/queries';
import uiStyles from "../UI/UIElements.module.css"
import { useAlertDispatch } from '../UI/AlertDispatch';
import { isFieldHasErrors } from '../User/formUtils';
import { CREATE_SUBSCRIPTION } from '../Plants/queries';
import { askPermission } from '../Plants/notifications-utils';

interface NotificationsProps {
  action: () => any
}

const defaultUserSettings: UserSettingsType = {
    notificationsStartTime: "",
    notificationsEndTime: "",
    notificationsInterval: 60,
    timezone: ""
  }


function Notifications({ action }: NotificationsProps) {
    const alertDispatch = useAlertDispatch()
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [settings, setSettings] = useState<UserSettingsType>(defaultUserSettings);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<Boolean>(false)

    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone


    const [ updateSettings, updateSettingsState ] = useMutation(UPSERT_USER_SETTINGS, {
      onCompleted: (data: any) => {
        const errors: FormErrors = data?.upsertUserSettings?.errors;
        if(errors) {
          setFormErrors(errors);
        } else {
          const userSettings = data?.upsertUserSettings?.userSettings
          userSettings && setSettings({...userSettings})
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

    const [subscribeToNotifications] = useMutation(CREATE_SUBSCRIPTION, {
      onCompleted: (data: { createSubscription: any }) => {
          console.log("subscription", data)
      },
      onError: (e) => console.error('Error creating subscription:', e)
    });


    const resetFieldErrors = (field: string) => {
      setFormErrors({...formErrors, [field]: []})
    }

    const { loading, error } = useQuery<UserSettingsData>(
        GET_USER_SETTINGS,
        {
          onCompleted: (data: UserSettingsData) => {
            setSettings({...data.userSettings})
          },
          onError: (e) => console.error('Error getting user settings:', e),
          fetchPolicy: 'network-only'
        }
      );


    const handleRefreshNotificationSubscription = () => {
      askPermission(() => null, (subscriptin: PushSubscription) => {
        const parsedSubscriptoin = JSON.parse(JSON.stringify(subscriptin))
        subscribeToNotifications({ variables:
            {
              endpoint: parsedSubscriptoin.endpoint,
              p256dh: parsedSubscriptoin.keys.p256dh,
              auth: parsedSubscriptoin.keys.auth,
              permissionGiven: true
            }
        })
    })
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { notificationsStartTime, notificationsEndTime, notificationsInterval, timezone } = settings;
      if(notificationsStartTime && notificationsEndTime && timezone) {
        updateSettings({ variables: {
          startTime: notificationsStartTime.slice(0, 5),
          endTime: notificationsEndTime.slice(0, 5),
          interval: notificationsInterval,
          timezone: timezone
        }});
      }
    }

    const handleStartTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      resetFieldErrors(event.target.name);
      event.target.value && setSettings({...settings, notificationsStartTime: event.target.value});
    };

    const handleEndTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      resetFieldErrors(event.target.name);
      event.target.value && setSettings({...settings, notificationsEndTime: event.target.value});
    };

    const handleTimezoneInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      resetFieldErrors(event.target.name);
      event.target.value && setSettings({...settings, timezone: event.target.value});
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      resetFieldErrors(name);
      switch(name) {
        case "notificationsInterval": setSettings({...settings, [name]: Number(event.target.value)}); break;
      }
    }

    const applyCurrentTimeZone = () => setSettings({...settings, timezone: currentTimeZone })

    return (
    <>
    <Form
      onSubmit={handleFormSubmit}
      autoFocus={false}
      data-testid="user-settings-form"
    >
      <FormGroup floating>
        <Input
          type="time"
          value={settings.notificationsStartTime}
          onChange={handleStartTimeInputChange}
          id="notificationsStartTime"
          name="notificationsStartTime"
          invalid={isFieldHasErrors("email", formErrors)}
          required
        />
        <Label for="notificationsStartTime">Start Time</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          type="time"
          value={settings.notificationsEndTime}
          onChange={handleEndTimeInputChange}
          id="notificationsEndTime"
          name="notificationsEndTime"
          required
        />
        <Label for="notificationsEndTime">End Time</Label>
      </FormGroup>
      <FormGroup>
        <Input
          type="range"
          min={15}
          max={60}
          step={15}
          value={settings.notificationsInterval}
          onChange={handleInputChange}
          id="notificationsInterval"
          name="notificationsInterval"
          required
        />
        <Label for="notificationsEndTime">Interval, {settings.notificationsInterval} min</Label>
      </FormGroup>
      <FormGroup floating>
        <InputGroup>
            <Input
            value={settings.timezone}
            onChange={handleTimezoneInputChange}
            id="userTimezone"
            name="userTimezone"
            required
            readOnly={true}
            />
            <Button title="Set current timezone" onClick={applyCurrentTimeZone}>
                <i className={"icon icon-location"}></i>
            </Button>
        </InputGroup>
      </FormGroup>
      <FormGroup>
          <Label for="notificationsEndTime">Notifications enabled</Label>
          <ButtonGroup>
            <Button color="primary" onClick={() => setIsNotificationsEnabled(false)} active={isNotificationsEnabled === true}>One</Button>
            <Button color="primary" onClick={() => setIsNotificationsEnabled(true)} active={isNotificationsEnabled === false}>Two</Button>
          </ButtonGroup>

          <ButtonToggle title="Resubscribe to notifications" onClick={handleRefreshNotificationSubscription} >
            Resubscribe to notifications
          </ButtonToggle>
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

export default Notifications
