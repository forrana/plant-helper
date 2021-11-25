import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import AlertContext from './AlertContext';
import AlertDispatch from './AlertDispatch';
import { MessageType } from './models';

const AlertManager = () => {
  const dispatch = useContext(AlertDispatch);

  const alertContext = useContext(AlertContext);

  const [message, setMessage] = useState<MessageType | null>(null);

  useEffect(() => {
    if(alertContext.messages.length) {
      console.log(alertContext.messages.length);
      const lastMessage = [...alertContext.messages].pop();
      if(lastMessage) setMessage(lastMessage)
    } else setMessage(null);
  },[alertContext])

  const hideError = () => {
      dispatch && dispatch({ type: "removeMessage" })
      setMessage(null)
  }

  if(message !== null) {
      return (
        <Alert
            color="danger"
            toggle={hideError}
        >
            {message.description}
        </Alert>
      )
    }
  return (<></>)
}

export default AlertManager