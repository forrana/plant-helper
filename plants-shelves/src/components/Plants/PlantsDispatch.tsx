import React, { createContext, Dispatch } from 'react';
import { PlantType } from './models'

const PlantsDispatch = React.createContext<Dispatch<{ type: string; plants?: PlantType[]; plant?: PlantType;}>| null>(null);

export default PlantsDispatch;
