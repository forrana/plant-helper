import { createContext } from 'react';
import { UserState } from './models'
import { getInitialState } from './UserReducer'

const UserContext = createContext<UserState>(getInitialState());

export default UserContext;