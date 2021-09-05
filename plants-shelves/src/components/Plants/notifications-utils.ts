const VAPID_PUBLIC: string = "BFZvVqR_GKulrPLvUl5iGfOms1z5A6pmA1osiJ6k3-NHKKdmyKxQPfAxYnCLtsxL_pNVkzqzVZ3CgPpvkN7TG5M"

interface Subscription {
    endpoint: string,
    keys: {
        p256dh: string,
        auth: string
    }
}

async function createNotificationSubscription(pushServerPublicKey: string) {
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    return await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: pushServerPublicKey
    });
  }

async function askPermission(pushServerPublicKey: string = VAPID_PUBLIC, rejectAction: () => any, acceptAction: (subscriptin: PushSubscription) => any) {
    if (!('serviceWorker' in navigator)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        return;
    }

    if (!('PushManager' in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        return;
    }
    const permissionResult_1 = await new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    });
    if (permissionResult_1 !== 'granted') {
      rejectAction()
      throw new Error('We weren\'t granted permission.');
    }
    const subscriptin = await createNotificationSubscription(pushServerPublicKey)
    acceptAction(subscriptin)
  }

  export { askPermission }