import { UserReducerAction, UserState } from './models'

const USER_STATE_STORAGE_KEY = "UserState"

const emptyState: UserState = { token: "", username: "" };

const getInitialState: () => UserState = () => {
  const initalStateFromLocalStorage: string | null = localStorage.getItem(USER_STATE_STORAGE_KEY);
  if(initalStateFromLocalStorage !== null) {
    return JSON.parse(initalStateFromLocalStorage);
  }
  return emptyState;
}

const initialUserState: UserState  = getInitialState();

const userReducer = (state: UserState, action: UserReducerAction) => {
  switch (action.type) {
    case 'login':
      return { token: action.token, username: action.username };
    case 'logout':
      return { ...emptyState };
  }
}

export { userReducer, initialUserState, getInitialState, USER_STATE_STORAGE_KEY };
