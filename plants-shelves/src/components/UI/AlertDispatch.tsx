import React, { Dispatch, useContext } from 'react';
import { AlertReducerAction } from './models';

const AlertDispatch = React.createContext<Dispatch<AlertReducerAction>| null>(null);

function useAlertDispatch() {
    const dispatch = useContext(AlertDispatch);
    if (dispatch === null) {
      throw new Error("useAlertDispatch must be within AlertDispatch provider");
    }

    return dispatch
  }

export default AlertDispatch
export { useAlertDispatch }