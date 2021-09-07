import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { CREATE_SUBSCRIPTION, GET_SUBSCRIPTION } from './queries'
import { SubscriptionData } from './models'
import { askPermission } from './notifications-utils';


function ManagePushSubscription() {
    useQuery<SubscriptionData>(
        GET_SUBSCRIPTION,
        {
          onCompleted: (data: SubscriptionData) => {
            console.log("subscription", data.subscription)
          },
          onError: (e) => console.error('Error getting subscription info:', e)
        }
      );

      const [subscribeToNotifications] = useMutation(CREATE_SUBSCRIPTION, {
        onCompleted: (data: { createSubscription: any }) => {
        },
        onError: (e) => console.error('Error creating plant:', e)
      });


    React.useEffect(
     function () {
        askPermission(() => null, (subscriptin: PushSubscription) => console.log(subscriptin))
     }
    , [])
    return (
        <>
        </>
    )
}

export default ManagePushSubscription