import React, { useContext, useState } from 'react';
import { Alert } from 'reactstrap';
import AlertDispatch from './AlertDispatch';
import { ErrorType } from './models';

const AlertManager = () => {
  const dispatch = useContext(AlertDispatch);

  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);

  const hideError = () => {
      dispatch && dispatch({ type: "removeError" })
      setErrorMessage(null)
  }

  if(errorMessage !== null) {
      return (
        <Alert
            color="danger"
            toggle={hideError}
        >
            {errorMessage.description}
        </Alert>
      )
    }
  return (<></>)
}

export default AlertManager