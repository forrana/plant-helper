import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { CREATE_SUBSCRIPTION, GET_SUBSCRIPTION } from './queries'
import { SubscriptionData } from './models'
import { askPermission } from './notifications-utils';


function ManagePushSubscription() {

  const [subscribeToNotifications] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: (data: { createSubscription: any }) => {
        console.log("subscription", data)
    },
    onError: (e) => console.error('Error creating subscription:', e)
  });

  useQuery<SubscriptionData>(
      GET_SUBSCRIPTION,
      {
        onCompleted: (data: SubscriptionData) => {
          if(!data.subscription) {
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
        },
        onError: (e) => console.error('Error getting subscription info:', e)
      }
    );

  return (
      <>
      </>
  )
}

export default ManagePushSubscription