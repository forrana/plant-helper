export interface Error {
  message: string;
  code: string;
}

export interface LoginError extends Error {}

export interface SignupErrors {
  [key: string]: Array<Error>
}

export interface UserState { token: string, username: string, refreshToken: string}

export interface loginAction  { type: 'login', token: string, refreshToken: string, username: string }
export interface logOutAction { type: 'logout' }

export type UserReducerAction =
  | loginAction
  | logOutAction
