import React, { Dispatch, useContext } from 'react';
import { UserReducerAction } from './models'

const UserDispatch = React.createContext<Dispatch<UserReducerAction> | null>(null);

function useUserDispatch() {
    const dispatch = useContext(UserDispatch);
    if (dispatch === null) {
      throw new Error("useUserDispatch must be within UserDispatch provider");
    }

    return dispatch
  }

export default UserDispatch
export { useUserDispatch }
