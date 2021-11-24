import { createContext } from 'react';
import { AlertState } from './models'
import { initialAlertState } from './AlertReducer'

const AlertContext = createContext<AlertState>(initialAlertState);

export default AlertContext;