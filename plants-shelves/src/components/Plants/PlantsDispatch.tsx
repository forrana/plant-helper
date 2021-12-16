import React, { Dispatch, useContext } from 'react';
import { GlobalReducerAction } from './models'


const PlantsDispatch = React.createContext<Dispatch<GlobalReducerAction>| null>(null);

const usePlantsDispatch = () => {
    const dispatch = useContext(PlantsDispatch);
    if (dispatch === null) {
      throw new Error("usePlantsDispatch must be within PlantsDispatch provider");
    }

    return dispatch
  }

export default PlantsDispatch
export { usePlantsDispatch }
