import { createContext } from 'react';
import { UserState } from './models'
import { initialUserState } from './UserReducer'

const UserContext = createContext<UserState>(initialUserState);

export default UserContext;