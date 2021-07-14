import React, { Dispatch } from 'react';
import { UserReducerAction } from './models'

const UserDispatch = React.createContext<Dispatch<UserReducerAction> | null>(null);

export default UserDispatch
