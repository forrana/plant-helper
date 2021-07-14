import { UserReducerAction, UserState } from './models'

const initialUserState: UserState  = { token: "", username: "" };

const userReducer = (state: UserState, action: UserReducerAction) => {
  switch (action.type) {
    case 'login':
      return { token: action.token, username: action.username };
    case 'logout':
      return { ...initialUserState };
    default:
      throw new Error("Unknown userReducer action");
  }
}

export { userReducer, initialUserState };
