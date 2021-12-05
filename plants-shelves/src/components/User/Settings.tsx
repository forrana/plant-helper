import { useQuery } from '@apollo/client';
import React from 'react';
import { UserSettingsData } from './models';
import { GET_USER_SETTINGS } from './queries';

function Settings() {
    const { loading, data, error } = useQuery<UserSettingsData>(
        GET_USER_SETTINGS,
        {
          onCompleted: (data: UserSettingsData) => {
            console.log(data)
          },
          onError: (e) => console.error('Error getting user settings:', e)
        }
      );

    return (<></>)
}

export default Settings
