import React, { Dispatch } from 'react';
import { GlobalReducerAction } from './models'

const PlantsDispatch = React.createContext<Dispatch<GlobalReducerAction>| null>(null);

export default PlantsDispatch
