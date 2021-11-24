import React, { Dispatch } from 'react';
import { AlertReducerAction } from './models';

const AlertDispatch = React.createContext<Dispatch<AlertReducerAction>| null>(null);

export default AlertDispatch
