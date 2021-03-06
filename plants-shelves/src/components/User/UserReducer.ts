import { UserReducerAction, UserState } from './models'

const USER_STATE_STORAGE_KEY = "UserState"

const emptyState: UserState = { token: "", username: "", refreshToken: "", expAt: Date.now(), userId: -1 };

const getInitialState: () => UserState = () => {
  const initalStateFromLocalStorage: string | null = localStorage.getItem(USER_STATE_STORAGE_KEY);
  if(initalStateFromLocalStorage !== null) {
    return JSON.parse(initalStateFromLocalStorage);
  }
  return emptyState;
}

const userReducer = (state: UserState, action: UserReducerAction) => {
  switch (action.type) {
    case 'login':
      return { token: action.token, refreshToken: action.refreshToken, username: action.username, expAt: action.exp, userId: action.userId };
    case 'logout':
      return { ...emptyState };
  }
}

export { userReducer, getInitialState, USER_STATE_STORAGE_KEY };
