import React, { FC, useEffect } from 'react';
import { Alert, Button } from 'reactstrap';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const ServiceWorkerWrapper: FC = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);
  const onDismiss = () => setShowReload(false);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    console.log("update recieved!");
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.replace(window.location.href);
  };

  return (
    <Alert color="info" isOpen={showReload} toggle={reloadPage}>
      <p>New version is available!</p>
      <p>Press reload to apply!</p>
      <Button
          color="primary"
          size="small"
          onClick={reloadPage}
        >
          Reload
      </Button>
    </Alert>
  );
}

export default ServiceWorkerWrapper;